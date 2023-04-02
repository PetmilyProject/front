import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import ContentTab from './navigations/ContentTab';

const App = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Navigation />
    </>
  );
};

export default App;
