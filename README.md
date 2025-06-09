# Beyond All Reason ([BAR](https://www.beyondallreason.info/)) Hotkey Trainer
This is something I threw together for myself when learning the game for the first time. It generated some interest in the community so I've polished it up a bit and am releasing it as open-source and a free tool for others to use, and hopefully grow.

[BAR Official Website](https://www.beyondallreason.info/)

## Stack
- Pinia: vue redux-esc state management https://pinia.vuejs.org/
- Vue3 https://vuejs.org
- Typescript
- Vite

## Plans
- [ ] Listen for other key presses like "shift" to clear last pressed key, "esc" to reset the state, something to toggle hotkeys on off
- [ ] Complete entries in `data/objects.yml` (would be nice to parse this from the main repo)
- [ ] Add more tools like price comparisons, etc etc
- [ ] Unit matchup testing (what unit should you build to counter X unit?)
- [ ] ...

## Contributing
Fork the repo and do your development on your fork. When your changes are ready, make a PR into the `main` branch and request my review.

### Set Up
You'll need Node, I'm running 18.20, anything 18 and up should be fine.

```
npm i

npm run dev
```

## Image Attribution
Images are not my own. Images were gathered from the BAR Website. For instance https://www.beyondallreason.info/units/armada-factories

Images © Beyond All Reason under CC BY-NC-ND 4.0, see [BAR License](https://github.com/beyond-all-reason/Beyond-All-Reason/blob/master/LICENSE.md)
