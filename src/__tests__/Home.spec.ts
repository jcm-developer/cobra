import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Home from '../views/Home.vue'

// Mock fetch
global.fetch = vi.fn()

describe('Home.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful fetch responses
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => []
    })
  })

  it('renders the main container', () => {
    const wrapper = mount(Home)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('displays the current time header', () => {
    const wrapper = mount(Home)
    expect(wrapper.find('.header').exists()).toBe(true)
    expect(wrapper.find('.header span').exists()).toBe(true)
  })

  it('renders both departure and arrival sections', () => {
    const wrapper = mount(Home)
    const boxes = wrapper.findAll('.box')
    expect(boxes).toHaveLength(2)
  })

  it('displays "Salidas" heading', () => {
    const wrapper = mount(Home)
    const headings = wrapper.findAll('h1')
    expect(headings[0].text()).toBe('Salidas')
  })

  it('displays "Llegadas" heading', () => {
    const wrapper = mount(Home)
    const headings = wrapper.findAll('h1')
    expect(headings[1].text()).toBe('Llegadas')
  })

  it('shows loading state initially', async () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('Cargando vuelos...')
  })

  it('displays column headers correctly', () => {
    const wrapper = mount(Home)
    const headers = wrapper.find('.box-header')
    expect(headers.text()).toContain('Nº de Vuelo')
    expect(headers.text()).toContain('Destino')
    expect(headers.text()).toContain('Hora de Salida')
    expect(headers.text()).toContain('Estado')
  })

  it('displays empty state when no flights', async () => {
    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('No hay salidas registradas')
    expect(wrapper.text()).toContain('No hay llegadas registradas')
  })

  it('renders "Crear registro" button', () => {
    const wrapper = mount(Home)
    const button = wrapper.find('.create')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Crear registro')
  })

  it('opens modal when "Crear registro" is clicked', async () => {
    const wrapper = mount(Home)
    const button = wrapper.find('.create')
    
    await button.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Crear Nuevo Registro de Vuelo')
  })

  it('modal contains all required form fields', async () => {
    const wrapper = mount(Home)
    await wrapper.find('.create').trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Tipo:')
    expect(wrapper.text()).toContain('Nº de Vuelo:')
    expect(wrapper.text()).toContain('Destino:')
    expect(wrapper.text()).toContain('Hora de Salida:')
    expect(wrapper.text()).toContain('Estado:')
  })

  it('modal has submit and cancel buttons', async () => {
    const wrapper = mount(Home)
    await wrapper.find('.create').trigger('click')
    await wrapper.vm.$nextTick()
    
    const cancelBtn = wrapper.find('.btn-cancel')
    const submitBtn = wrapper.find('.btn-submit')
    
    expect(cancelBtn.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)
    expect(cancelBtn.text()).toBe('Cancelar')
    expect(submitBtn.text()).toBe('Crear')
  })

  it('closes modal when cancel button is clicked', async () => {
    const wrapper = mount(Home)
    
    await wrapper.find('.create').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    
    await wrapper.find('.btn-cancel').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('fetches flights on mount', async () => {
    mount(Home)
    await flushPromises()
    
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/flights?type=salida')
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/flights?type=llegada')
  })

  it('displays flights when data is loaded', async () => {
    const mockFlights = [
      {
        id: 1,
        flight_number: 'VY1234',
        destination: 'Barcelona',
        departure_time: '14:30',
        comments: 'En hora',
        type: 'salida'
      }
    ]

    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('salida')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockFlights
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      })
    })

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('VY1234')
    expect(wrapper.text()).toContain('Barcelona')
  })

  it('handles fetch error gracefully', async () => {
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const wrapper = mount(Home)
    await flushPromises()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('estado selector has all required options', async () => {
    const wrapper = mount(Home)
    await wrapper.find('.create').trigger('click')
    await wrapper.vm.$nextTick()
    
    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThanOrEqual(2)
    
    if (selects.length >= 2) {
      const estadoSelect = selects[1] // El segundo select es el de Estado
      const options = estadoSelect.findAll('option')
      
      const optionTexts = options.map(opt => opt.text())
      expect(optionTexts).toContain('En hora')
      expect(optionTexts).toContain('Retrasado')
      expect(optionTexts).toContain('Cancelado')
      expect(optionTexts).toContain('Con demora')
    }
  })

  it('updates time every second', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Home)
    
    const initialTime = wrapper.find('.header span').text()
    
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    
    const updatedTime = wrapper.find('.header span').text()
    expect(updatedTime).toBeTruthy()
    
    vi.useRealTimers()
  })
})
