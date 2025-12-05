import 'react-native-gesture-handler'; // MUST BE FIRST - Required for Drawer
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
