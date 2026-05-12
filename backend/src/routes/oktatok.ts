import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Oktato } from '../entity/Oktato';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(Oktato);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const oktatoklist = await repo().find({ relations: ['tantargyak'] });
    res.json(oktatoklist);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const oktato = await repo().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['tantargyak', 'tantargyak.kurzusok'],
    });
    if (!oktato) return res.status(404).json({ message: 'Nem található.' });
    res.json(oktato);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { nev, tanszek } = req.body;
    if (!nev || !tanszek) return res.status(400).json({ message: 'Név és tanszék kötelező.' });
    const uj = repo().create({ nev, tanszek });
    await repo().save(uj);
    res.status(201).json(uj);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const oktato = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!oktato) return res.status(404).json({ message: 'Nem található.' });
    repo().merge(oktato, req.body);
    await repo().save(oktato);
    res.json(oktato);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const oktato = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!oktato) return res.status(404).json({ message: 'Nem található.' });
    await repo().remove(oktato);
    res.json({ message: 'Törölve.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
