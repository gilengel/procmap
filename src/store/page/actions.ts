import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PageStateInterface } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page'

const actions: ActionTree<PageStateInterface, StateInterface> = {
  /**
   * Updates an already stored page in the store and in the backend.
   * @param page
   */
   updatePage(stage, page: Page) {
     this.commit('_updatePage', page)
   },

   /**
    * Updates an already stored new page in the store.
    * @param page
    */
   updateNewPage(stage, params: { page: NewPage, update: UpdateNewPage }) {
     this.commit('_updateNewPage', params)
   },

  /**
  * Adds a new page to the local store.
  * Be aware that the page is not persisted to backend. For this see @see persistNewPage.
  * @param newPage The page to be saved
  */
   storeNewPage(stage, page: NewPage) {
     this.commit('_storeNewPage', page)
   },

   /**
   * Persists a new page to the backend and adding the result to the local store.
   * In case you only want to store it to the local store withtout backend persistance @see storeNewPage.
   * @param newPage The page to be saved
   */
   persistNewPage(stage, page: NewPage) {
     this.commit('_persistNewPage', page)
   }
};

export default actions;
