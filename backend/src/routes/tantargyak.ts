import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Tantargy } from '../entity/Tantargy';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(Tantargy);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const lista = await repo().find({ relations: ['oktato', 'kurzusok'] });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tantargy = await repo().findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['oktato', 'kurzusok'],
    });
    if (!tantargy) return res.status(404).json({ message: 'Nem található.' });
    res.json(tantargy);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { nev, kredit, oktatoId } = req.body;
    if (!nev || !kredit) return res.status(400).json({ message: 'Név és kredit kötelező.' });
    const uj = repo().create({ nev, kredit, oktatoId });
    await repo().save(uj);
    res.status(201).json(uj);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tantargy = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!tantargy) return res.status(404).json({ message: 'Nem található.' });
    repo().merge(tantargy, req.body);
    await repo().save(tantargy);
    res.json(tantargy);
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tantargy = await repo().findOneBy({ id: parseInt(req.params.id) });
    if (!tantargy) return res.status(404).json({ message: 'Nem található.' });
    await repo().remove(tantargy);
    res.json({ message: 'Törölve.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
