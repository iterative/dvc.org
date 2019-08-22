describe('SidebarMenu/helper', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('default', () => {
    it('Resolves shortcuts to full syntax', () => {
      const rawData = ['item-name']
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/static/docs/item-name.md',
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed source and label fields', () => {
      const rawData = [{ slug: 'item-name' }]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/static/docs/item-name.md',
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed source field', () => {
      const rawData = [{ slug: 'item-name', label: 'Custom Label' }]
      const result = [
        {
          label: 'Custom Label',
          path: '/doc/item-name',
          source: '/static/docs/item-name.md',
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed label field', () => {
      const rawData = [{ slug: 'item-name', source: 'item-name/index.md' }]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/static/docs/item-name/index.md',
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Resolves multiple nested levels', () => {
      const rawData = [
        {
          slug: 'item-name',
          children: [{ slug: 'nested-item', children: ['subnested-item'] }]
        }
      ]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/static/docs/item-name.md',
          prev: undefined,
          next: '/doc/item-name/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/item-name/nested-item',
              source: '/static/docs/item-name/nested-item.md',
              prev: '/doc/item-name',
              next: '/doc/item-name/nested-item/subnested-item',
              children: [
                {
                  label: 'Subnested Item',
                  path: '/doc/item-name/nested-item/subnested-item',
                  source:
                    '/static/docs/item-name/nested-item/subnested-item.md',
                  prev: '/doc/item-name/nested-item',
                  next: undefined
                }
              ]
            }
          ]
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds correct prev/next links in nested list', () => {
      const rawData = [
        { slug: 'first-item', children: ['nested-item'] },
        'second-item'
      ]
      const result = [
        {
          label: 'First Item',
          path: '/doc/first-item',
          source: '/static/docs/first-item.md',
          prev: undefined,
          next: '/doc/first-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/first-item/nested-item',
              source: '/static/docs/first-item/nested-item.md',
              prev: '/doc/first-item',
              next: '/doc/second-item'
            }
          ]
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: '/static/docs/second-item.md',
          prev: '/doc/first-item/nested-item',
          next: undefined
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds correct prev/next links for for sourceless items', () => {
      const rawData = [
        'first-item',
        { slug: 'second-item', source: false, children: ['nested-item'] }
      ]
      const result = [
        {
          label: 'First Item',
          path: '/doc/first-item',
          source: '/static/docs/first-item.md',
          prev: undefined,
          next: '/doc/second-item'
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: false,
          prev: '/doc/first-item',
          next: '/doc/second-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/second-item/nested-item',
              source: '/static/docs/second-item/nested-item.md',
              prev: '/doc/first-item',
              next: undefined
            }
          ]
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it('Adds correct prev/next links for for nested sourceless items', () => {
      const rawData = [
        'first-item',
        {
          slug: 'second-item',
          source: false,
          children: [
            { slug: 'nested-item', source: false, children: ['subnested-item'] }
          ]
        }
      ]
      const result = [
        {
          label: 'First Item',
          path: '/doc/first-item',
          source: '/static/docs/first-item.md',
          prev: undefined,
          next: '/doc/second-item'
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: false,
          prev: '/doc/first-item',
          next: '/doc/second-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/second-item/nested-item',
              source: false,
              prev: '/doc/first-item',
              next: '/doc/second-item/nested-item/subnested-item',
              children: [
                {
                  label: 'Subnested Item',
                  path: '/doc/second-item/nested-item/subnested-item',
                  source:
                    '/static/docs/second-item/nested-item/subnested-item.md',
                  prev: '/doc/first-item',
                  next: undefined
                }
              ]
            }
          ]
        }
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const sidebarData = require('./helper').default

      expect(sidebarData).toEqual(result)
    })

    it("Throws error if item didn't have slug field", () => {
      const rawData = [{}]

      jest.doMock('../sidebar.json', () => rawData)

      expect(() => require('./helper')).toThrow(
        new Error("'slug' field is required in objects in sidebar.json")
      )
    })

    it("Throws error if item has source: false and don't has children", () => {
      const rawData = [{ slug: 'item-name', source: false }]

      jest.doMock('../sidebar.json', () => rawData)

      expect(() => require('./helper')).toThrow(
        new Error(
          "If you set 'source' to false, you had to add at least one child"
        )
      )
    })
  })

  describe('getItemByPath', () => {
    it('Returns first child for the /doc path', () => {
      const rawData = ['item-name']
      const result = {
        label: 'Item Name',
        path: '/doc/item-name',
        source: '/static/docs/item-name.md',
        prev: undefined,
        next: undefined
      }

      jest.doMock('../sidebar.json', () => rawData)
      const { getItemByPath } = require('./helper')

      expect(getItemByPath('/doc')).toEqual(result)
    })

    it('Returns first child with source for sourceless parents', () => {
      const rawData = [
        {
          slug: 'item-name',
          source: false,
          children: [
            { slug: 'nested-item', source: false, children: ['subnested-item'] }
          ]
        }
      ]
      const result = {
        label: 'Subnested Item',
        path: '/doc/item-name/nested-item/subnested-item',
        source: '/static/docs/item-name/nested-item/subnested-item.md',
        prev: undefined,
        next: undefined
      }

      jest.doMock('../sidebar.json', () => rawData)
      const { getItemByPath } = require('./helper')

      expect(getItemByPath('/doc/item-name')).toEqual(result)
    })
  })

  describe('getParentsListFromPath', () => {
    it("Returns array of current and parent's paths", () => {
      const rawData = []
      const path = '/doc/item-name/nested-item/subnested-item'
      const result = [
        '/doc/item-name',
        '/doc/item-name/nested-item',
        '/doc/item-name/nested-item/subnested-item'
      ]

      jest.doMock('../sidebar.json', () => rawData)
      const { getParentsListFromPath } = require('./helper')

      expect(getParentsListFromPath(path)).toEqual(result)
    })
  })
})
