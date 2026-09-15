import { runContentFactory } from './contentFactoryWorker';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Iniciando prueba piloto de la Fábrica de Contenidos...');

runContentFactory()
  .then(() => { console.log('🏁 Prueba terminada.'); })
  .catch(err => { console.error('❌ Error en la prueba:', err); });
