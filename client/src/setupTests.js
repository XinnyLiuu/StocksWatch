import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/**
 * Required for Jest + Enzyme
 */
configure({ adapter: new Adapter() });