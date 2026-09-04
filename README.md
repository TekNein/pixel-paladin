# Pixel Paladin

A proof-of-concept dungeon crawler for Slay the Foul Undead.

## Controls

- **WASD / Arrows** — Move
- **LMB** — Attack
- **RMB** — Block
- **Shift** — Sprint
- **E** — Interact (tithe gold for favor)

## Enemy Tiers

| Color | Name | Difficulty |
|-------|------|------------|
| White | Skeleton | Easy |
| Green | Bone Runner | Easy |
| Yellow | Cursed Bones | Medium |
| Orange | Hell Skeleton | Hard |
| Red | Infernal Remains | Very Hard |
| Purple | LICH LORD | Boss |

## How to Deploy

### Option 1: Vercel (Recommended)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Click "Deploy" — that's it!

### Option 2: Netlify

1. Push this project to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Deploy!

### Option 3: Local Development

Run a local server:

```bash
# Python 3
python3 -m http.server 8080

# Then open http://localhost:8080
```

## Tech Stack

- **Phaser 3** (via CDN) — game framework
- **No build step required** — vanilla JS, serves static
- **1080p** with fit-to-screen scaling
- **Arcade physics** — built-in platformer physics
