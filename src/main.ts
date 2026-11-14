import './styles.css';
import { installDefs } from './engine/ui';
import { Game } from './game';

if (window.parent !== window) document.body.classList.add('im-hub');
installDefs();
const game = new Game();
(window as unknown as { __game: Game }).__game = game;
void game.start();
