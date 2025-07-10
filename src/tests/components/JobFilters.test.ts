import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import JobFilters from '@/components/JobFilters.vue'

describe('JobFilters', () => {
  const defaultProps = {
    filters: {
      status: null,
      search: null,
      sort: 'newest',
    },
    loading: false,
  }

  it('renders all filter elements', () => {
    const wrapper = mount(JobFilters, {
      props: defaultProps,
    })

    expect(wrapper.find('input[placeholder*="Search"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="status-filter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="sort-filter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="clear-filters"]').exists()).toBe(true)
  })

  it('emits filters-change when search input changes', async () => {
    const wrapper = mount(JobFilters, {
      props: defaultProps,
    })

    const searchInput = wrapper.find('input[placeholder*="Search"]')
    await searchInput.setValue('tech company')
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 500))
    
    expect(wrapper.emitted('filters-change')).toBeTruthy()
    expect(wrapper.emitted('filters-change')![0][0]).toEqual({
      search: 'tech company',
      status: null,
      sort: 'newest',
    })
  })

  it('emits filters-change when status filter changes', async () => {
    const wrapper = mount(JobFilters, {
      props: defaultProps,
    })

    // Simulate status change
    await wrapper.vm.selectedStatus = 'Applied'
    await nextTick()

    expect(wrapper.emitted('filters-change')).toBeTruthy()
  })

  it('clears all filters when clear button is clicked', async () => {
    const wrapper = mount(JobFilters, {
      props: {
        filters: {
          status: 'Applied',
          search: 'tech',
          sort: 'company-asc',
        },
        loading: false,
      },
    })

    await wrapper.find('[data-testid="clear-filters"]').trigger('click')

    expect(wrapper.vm.searchQuery).toBe('')
    expect(wrapper.vm.selectedStatus).toBe('all')
    expect(wrapper.vm.selectedSort).toBe('newest')
  })

  it('disables inputs when loading', () => {
    const wrapper = mount(JobFilters, {
      props: {
        ...defaultProps,
        loading: true,
      },
    })

    expect(wrapper.find('input[placeholder*="Search"]').attributes('disabled')).toBeDefined()
  })
})