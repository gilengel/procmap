import { MutationTree } from 'vuex';
import { StyleStateInterface, lightTheme, darkTheme } from './state';

import { setCssVar } from 'quasar'

import { Style } from 'src/models/Style';

const mutation: MutationTree<StyleStateInterface> = {
    _setStyle (state, style: Style) {
        const colors = style == Style.Light ? lightTheme : darkTheme;
        setCssVar('primary', colors.primary);
        setCssVar('secondary', colors.secondary);
        setCssVar('accent', colors.accent);
        setCssVar('dark', colors.dark);

        state._style = style
    }
};

export default mutation;
