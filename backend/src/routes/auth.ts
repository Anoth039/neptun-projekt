import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Felhasznalo } from '../entity/Felhasznalo';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();
const repo = () => AppDataSource.getRepository(Felhasznalo);

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { felhasznalonev, jelszo } = req.body;
    if (!felhasznalonev || !jelszo) {
      return res.status(400).json({ message: 'Felhasználónév és jelszó kötelező.' });
    }
    const letezik = await repo().findOneBy({ felhasznalonev });
    if (letezik) {
      return res.status(409).json({ message: 'Ez a felhasználónév már foglalt.' });
    }
    const hash = await bcrypt.hash(jelszo, 10);
    const uj = repo().create({ felhasznalonev, jelszo: hash });
    await repo().save(uj);
    res.status(201).json({ message: 'Sikeres regisztráció.' });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { felhasznalonev, jelszo } = req.body;
    const felhasznalo = await repo().findOneBy({ felhasznalonev });
    if (!felhasznalo) {
      return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó.' });
    }
    const egyezik = await bcrypt.compare(jelszo, felhasznalo.jelszo);
    if (!egyezik) {
      return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó.' });
    }
    const token = jwt.sign(
      { id: felhasznalo.id, felhasznalonev: felhasznalo.felhasznalonev },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );
    res.json({ token, felhasznalonev: felhasznalo.felhasznalonev });
  } catch (err) {
    res.status(500).json({ message: 'Szerverhiba.', error: err });
  }
});

export default router;
