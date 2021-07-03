import { ref } from 'vue'
import axios, { AxiosError } from 'axios'

export interface Icon {
    name: string,
    type: string,
    unicode: string
}

export default function getIconsFromBackend(url: string) {
    const icons = ref(new Array<Icon>())

    const status = ref(0)

    const onFetch = () => {
        axios
        .request<Array<Icon>>({
          url: url
        })
        .then((response) => {
          const { data } = response

          icons.value = data
          status.value = response.status
        })
        .catch((error : AxiosError) => {
            // Generic error if url is completly wrong and no connection to backend possible
            if(!error.response){
                status.value = 403
                return
            }

            status.value = error.response.status
        })
    }

    return {
        icons,
        status,
        onFetch
    }
}
