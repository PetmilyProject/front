import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';

const App = () => {
  return (
    <>
      <StatusBar style="dark" />
      {/* <FirstScreen /> */}
      <Navigation />
    </>
  );
};

export default App;
