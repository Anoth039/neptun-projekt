import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Kurzus } from '../entity/Kurzus';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(Kurzus);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const lista = await repo().find({ relations: ['tantargy', 'tantargy.oktato'] });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const kurzus = await repo().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['tantargy', 'tantargy.oktato', 'beiratkozasok', 'beiratkozasok.hallgato'],
    });
    if (!kurzus) return res.status(404).json({ message: 'Nem található.' });
    res.json(kurzus);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { kurzusKod, felev, maxLetszam, tantargyId } = req.body;
    if (!kurzusKod || !felev || !tantargyId) {
      return res.status(400).json({ message: 'Kurzuskód, félév és tantárgy kötelező.' });
    }
    const uj = repo().create({ kurzusKod, felev, maxLetszam: maxLetszam || 30, tantargyId });
    await repo().save(uj);
    res.status(201).json(uj);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const kurzus = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!kurzus) return res.status(404).json({ message: 'Nem található.' });
    repo().merge(kurzus, req.body);
    await repo().save(kurzus);
    res.json(kurzus);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const kurzus = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!kurzus) return res.status(404).json({ message: 'Nem található.' });
    await repo().remove(kurzus);
    res.json({ message: 'Törölve.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
