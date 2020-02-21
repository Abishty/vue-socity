import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Dropdown from '@/components/Dropdown'
import constants from '~/constants'

const factory = () => {
  return shallowMount(Dropdown, {
    mocks: {
      $route: {
        params: {
          city: 'delhi'
        }
      },
      data() {
        return {
          cities: constants.CITIES
        }
      }
    },
    stubs: {
      NuxtLink: RouterLinkStub
    }
  })
}

describe('Testing the Dropdown component', () => {
  test('it should render correctly', () => {
    const wrapper = factory()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('if city click emits the cityChange fn', async () => {
    const wrapper = factory()
    wrapper.find('.city-div').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().changeCity).toBeTruthy()
  })
})
