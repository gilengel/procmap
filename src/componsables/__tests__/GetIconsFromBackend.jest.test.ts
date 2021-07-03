import getIconsFromBackend from 'src/componsables/GetIconsFormBackend'
import { watch } from 'vue'

describe('GetIconsFromBackend', () => {
    it('loading icons from server return list of icons', done => {
        const { icons, onFetch } = getIconsFromBackend('https://gist.githubusercontent.com/lukethacoder/e1a277c16f36cbbb76ffe8105de9d3ab/raw/b4751a329400642f7847d5f9953db649a820b7e7/line-awesome-array-objects.json')

        onFetch()
        watch(icons, () => {
            expect(icons.value.length).toBeGreaterThan(0)
            done();
        })
    }),

    it('failing loading icons from server prints error on console', done => {
        const { status, onFetch } = getIconsFromBackend('UNAVAILABLE_BACKEND_SERVER_URL')

        onFetch()
        watch(status, () => {
            expect(status.value).not.toBe(200)
            done();
        })
    })
});
