import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Hallgato } from '../entity/Hallgato';
import { Beiratkozas } from '../entity/Beiratkozas';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(Hallgato);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const lista = await repo().find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const hallgato = await repo().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['beiratkozasok', 'beiratkozasok.kurzus', 'beiratkozasok.kurzus.tantargy'],
    });
    if (!hallgato) return res.status(404).json({ message: 'Nem található.' });
    res.json(hallgato);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/:id/atlag', async (req: Request, res: Response) => {
  try {
    const beiratkozasok = await AppDataSource.getRepository(Beiratkozas).find({
      where: { hallgatoId: parseInt(req.params.id) },
    });
    const jegyek = beiratkozasok.filter((b) => b.jegy !== null).map((b) => b.jegy as number);
    const atlag = jegyek.length > 0 ? jegyek.reduce((a, b) => a + b, 0) / jegyek.length : null;
    res.json({ atlag, jegyek: jegyek.length });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { nev, tankor } = req.body;
    if (!nev || !tankor) return res.status(400).json({ message: 'Név és tankör kötelező.' });

    const letezik = await repo().findOneBy({ nev, tankor });
    if (letezik) return res.status(409).json({ message: 'Ez a hallgató már létezik.' });
    
    const uj = repo().create({ nev, tankor });
    await repo().save(uj);
    res.status(201).json(uj);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hallgato = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!hallgato) return res.status(404).json({ message: 'Nem található.' });

    const { nev, tankor } = req.body;
    const letezik = await repo().findOneBy({ nev, tankor });
    if (letezik && letezik.id !== hallgato.id) {
      return res.status(409).json({ message: 'Ez a hallgató már létezik.' });
    }
    
    repo().merge(hallgato, req.body);
    await repo().save(hallgato);
    res.json(hallgato);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hallgato = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!hallgato) return res.status(404).json({ message: 'Nem található.' });
    await repo().remove(hallgato);
    res.json({ message: 'Törölve.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
