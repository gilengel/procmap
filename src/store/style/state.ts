
import { Style, StyleColors } from 'src/models/Style'

export const darkTheme = {
    name: 'Dark',
    primary: '#222222',
    secondary: '#111111',
    accent: '#333333',
    dark: '#22252b'
};

export const lightTheme = {
    name: 'Light',
    primary: '#cce6ff',
    secondary: '#0052a3',
    accent: '#f57b00',
    dark: '#ffffff'
};

export interface StyleStateInterface {
  /**
   * 
   */
   _styleColors: StyleColors;

   /**
    * 
    */
   _style: Style;

}

function state(): StyleStateInterface {
  return {
    _style: Style.Light,
    _styleColors: lightTheme
  }
};

export default state;
