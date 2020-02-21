import { shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils'
import Header from '@/components/Header'
import Dropdown from '@/components/Dropdown'

const FontAwesomeIconStub = '<i class="stub"></i>'

const transitionStub = () => ({
  render(h) {
    return this.$options._renderChildren
  }
})

const factory = () => {
  return shallowMount(Header, {
    mocks: {
      $route: {
        params: {
          city: 'delhi'
        }
      },
      $router: [],
      data() {
        return {
          showDropdown: false,
          city: 'delhi'
        }
      }
    },
    stubs: {
      NuxtLink: RouterLinkStub,
      transition: transitionStub(),
      FontAwesomeIcon: FontAwesomeIconStub
    }
  })
}

describe('Header', () => {
  afterEach(() => {
    window.pageYOffset = 0
  })

  test('mounts properly', () => {
    const wrapper = factory()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = factory()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Header renders with dropdown correctly', async () => {
    const wrapper = factory()
    wrapper.setData({ showDropdown: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('to check toggleDropdown function toggles the "showDropdown" variable', async () => {
    const wrapper = factory()
    wrapper.find('#arrow').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showDropdown).toBe(true)
    wrapper.find('#arrow').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showDropdown).toBe(false)
  })

  test('to see if Dropdown is rendered to the screen', async () => {
    const wrapper = factory()
    wrapper.setData({ showDropdown: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find(Dropdown).exists()).toBeTruthy()
  })

  test('to check if clicking a city in the dropdown emits "cityChange" in the Header', async () => {
    const wrapper = factory()
    wrapper.setData({ showDropdown: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find(Dropdown).exists()).toBeTruthy()
  })

  test('to check if the dropdown emit is reaching the Header', async () => {
    const wrapper = factory()
    wrapper.setData({ showDropdown: true })
    wrapper.setMethods({ changeCity: jest.fn() })
    await wrapper.vm.$nextTick()
    wrapper.find(Dropdown).vm.$emit('changeCity')
    expect(wrapper.vm.changeCity).toHaveBeenCalled()
  })

  test('to check if the handleScroll fn is adding and removing the sticky class on the header', async () => {
    const localVue = createLocalVue()
    const wrapper = shallowMount(Header, {
      localVue,
      attachToDocument: true,
      mocks: {
        $route: {
          params: {
            city: 'delhi'
          }
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        transition: transitionStub()
      }
    })
    const header = wrapper.find('.header-container')
    window.pageYOffset = 2000
    await wrapper.vm.handleScroll()
    expect(header.classes()).toContain('sticky')
    window.pageYOffset = 0
    await wrapper.vm.handleScroll()
    expect(header.classes()).not.toContain('sticky')
  })

  it('Should toggle the "isDark" variable in the header component', async () =>{
    const wrapper = factory()
    wrapper.setData({ isDark: false })
    wrapper.find('.switch-wrap').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDark).toBe(true)
    wrapper.find('.switch-wrap').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDark).toBe(false)
  })

  test('Should test the $route variable', () => {
    const wrapper = factory()
    wrapper.vm.$options.watch.$route.handler.call(wrapper.vm)
    expect(wrapper.vm.city).toBe(wrapper.vm.$route.params.city)
  })

  test('changeCity should call toggleDropdown as well', async () => {
    const wrapper = factory()
    wrapper.setMethods({ toggleDropdown: jest.fn() })
    wrapper.vm.$options.methods.changeCity.call(wrapper.vm, 'delhi')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.toggleDropdown).toHaveBeenCalled()
  })

  test('Should return the computed property cityName', () => {
    const localVue = createLocalVue()
    let wrapper = shallowMount(Header, {
      localVue,
      attachToDocument: true,
      mocks: {
        $route: {
          params: {
            city: 'delhi'
          }
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        transition: transitionStub()
      }
    })
    expect(wrapper.vm.cityName).toBe('Delhi')
    wrapper = shallowMount(Header, {
      localVue,
      attachToDocument: true,
      mocks: {
        $route: {
          params: {
            city: ''
          }
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        transition: transitionStub()
      }
    })
    expect(wrapper.vm.cityName).toBe('Delhi')
    wrapper = shallowMount(Header, {
      localVue,
      attachToDocument: true,
      mocks: {
        $route: {
          params: {
            city: 'agra'
          }
        }
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        transition: transitionStub()
      }
    })
    expect(wrapper.vm.cityName).toBe('Agra')
  })
})
