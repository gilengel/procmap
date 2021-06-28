import { getCurrentInstance } from 'vue';
import { Events } from 'src/boot/mitt';
import { Emitter } from 'mitt';

const getEmitter = () : Emitter<Events> | undefined => {
  const internalInstance = getCurrentInstance();

  if (!internalInstance) {
    return;
  }

  const emitter = internalInstance.appContext.config.globalProperties
    .$mitt as Emitter<Events>;
  return emitter;
};

export default getEmitter;
