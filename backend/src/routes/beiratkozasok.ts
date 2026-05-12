import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Beiratkozas } from '../entity/Beiratkozas';
import { Hallgato } from '../entity/Hallgato';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(Beiratkozas);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const lista = await repo().find({
      relations: ['hallgato', 'kurzus', 'kurzus.tantargy'],
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/tankor-atlag/:tankor', async (req: Request, res: Response) => {
  try {
    const tankor = decodeURIComponent(req.params.tankor);
    const hallgatok = await AppDataSource.getRepository(Hallgato).find({ where: { tankor } });
    if (hallgatok.length === 0) {
      return res.json({ tankor, atlag: null, hallgatokSzama: 0 });
    }
    const hallgatoIds = hallgatok.map((h) => h.id);
    const beiratkozasok = await repo().find({
      where: hallgatoIds.map((id) => ({ hallgatoId: id })),
    });
    const jegyek = beiratkozasok.filter((b) => b.jegy !== null).map((b) => b.jegy as number);
    const atlag = jegyek.length > 0 ? jegyek.reduce((a, b) => a + b, 0) / jegyek.length : null;
    res.json({ tankor, atlag, hallgatokSzama: hallgatok.length, jegyekSzama: jegyek.length });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hallgatoId, kurzusId } = req.body;
    if (!hallgatoId || !kurzusId) {
      return res.status(400).json({ message: 'hallgatoId és kurzusId kötelező.' });
    }

    const meglevo = await AppDataSource.query(
      `SELECT b.id FROM beiratkozas b
       JOIN kurzus k ON b.kurzusId = k.id
       WHERE b.hallgatoId = ? AND k.tantargyId = (
         SELECT tantargyId FROM kurzus WHERE id = ?
       )`,
      [hallgatoId, kurzusId]
    );
    if (meglevo.length > 0) {
      return res.status(409).json({ message: 'A hallgató már felvette ezt a tantárgyat.' });
    }

    const uj = repo().create({ hallgatoId, kurzusId, jegy: null });
    await repo().save(uj);
    res.status(201).json(uj);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.patch('/:id/jegy', authMiddleware, async (req: Request, res: Response) => {
  try {
    const beiratkozas = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!beiratkozas) return res.status(404).json({ message: 'Nem található.' });
    const { jegy } = req.body;
    if (jegy < 1 || jegy > 5) {
      return res.status(400).json({ message: 'Az érdemjegy 1 és 5 közé kell essen.' });
    }
    beiratkozas.jegy = jegy;
    await repo().save(beiratkozas);
    res.json(beiratkozas);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const beiratkozas = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!beiratkozas) return res.status(404).json({ message: 'Nem található.' });
    await repo().remove(beiratkozas);
    res.json({ message: 'Törölve.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
