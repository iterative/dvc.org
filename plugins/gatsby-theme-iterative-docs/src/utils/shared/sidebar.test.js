/* eslint-env jest */

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
          source: '/docs/item-name.md',
          tutorials: {},
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed source and label fields', () => {
      const rawData = [{ slug: 'item-name' }]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/docs/item-name.md',
          tutorials: {},
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed source field', () => {
      const rawData = [{ slug: 'item-name', label: 'Custom Label' }]
      const result = [
        {
          label: 'Custom Label',
          path: '/doc/item-name',
          source: '/docs/item-name.md',
          tutorials: {},
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Adds missed label field', () => {
      const rawData = [{ slug: 'item-name', source: 'item-name/index.md' }]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/docs/item-name/index.md',
          tutorials: {},
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Forwards tutorials', () => {
      const rawData = [
        {
          slug: 'item-name',
          tutorials: {
            katacoda: 'https://www.katacoda.com/dvc/courses/get-started'
          }
        }
      ]
      const result = [
        {
          label: 'Item Name',
          path: '/doc/item-name',
          source: '/docs/item-name.md',
          tutorials: {
            katacoda: 'https://www.katacoda.com/dvc/courses/get-started'
          },
          prev: undefined,
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

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
          source: '/docs/item-name.md',
          tutorials: {},
          prev: undefined,
          next: '/doc/item-name/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/item-name/nested-item',
              source: '/docs/item-name/nested-item.md',
              tutorials: {},
              prev: '/doc/item-name',
              next: '/doc/item-name/nested-item/subnested-item',
              children: [
                {
                  label: 'Subnested Item',
                  path: '/doc/item-name/nested-item/subnested-item',
                  source: '/docs/item-name/nested-item/subnested-item.md',
                  tutorials: {},
                  prev: '/doc/item-name/nested-item',
                  next: undefined
                }
              ]
            }
          ]
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

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
          source: '/docs/first-item.md',
          tutorials: {},
          prev: undefined,
          next: '/doc/first-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/first-item/nested-item',
              source: '/docs/first-item/nested-item.md',
              tutorials: {},
              prev: '/doc/first-item',
              next: '/doc/second-item'
            }
          ]
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: '/docs/second-item.md',
          tutorials: {},
          prev: '/doc/first-item/nested-item',
          next: undefined
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Adds correct prev/next links for sourceless items', () => {
      const rawData = [
        'first-item',
        { slug: 'second-item', source: false, children: ['nested-item'] }
      ]
      const result = [
        {
          label: 'First Item',
          path: '/doc/first-item',
          source: '/docs/first-item.md',
          tutorials: {},
          prev: undefined,
          next: '/doc/second-item'
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: false,
          tutorials: {},
          prev: '/doc/first-item',
          next: '/doc/second-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/second-item/nested-item',
              source: '/docs/second-item/nested-item.md',
              tutorials: {},
              prev: '/doc/first-item',
              next: undefined
            }
          ]
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it('Adds correct prev/next links for nested sourceless items', () => {
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
          source: '/docs/first-item.md',
          tutorials: {},
          prev: undefined,
          next: '/doc/second-item'
        },
        {
          label: 'Second Item',
          path: '/doc/second-item',
          source: false,
          tutorials: {},
          prev: '/doc/first-item',
          next: '/doc/second-item/nested-item',
          children: [
            {
              label: 'Nested Item',
              path: '/doc/second-item/nested-item',
              source: false,
              tutorials: {},
              prev: '/doc/first-item',
              next: '/doc/second-item/nested-item/subnested-item',
              children: [
                {
                  label: 'Subnested Item',
                  path: '/doc/second-item/nested-item/subnested-item',
                  source: '/docs/second-item/nested-item/subnested-item.md',
                  tutorials: {},
                  prev: '/doc/first-item',
                  next: undefined
                }
              ]
            }
          ]
        }
      ]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const sidebarData = require('./sidebar').structure

      expect(sidebarData).toEqual(result)
    })

    it("Throws error if external item doesn't have a url field", () => {
      const rawData = [{ type: 'external' }]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)

      expect(() => require('./sidebar')).toThrow(
        new Error("'url' field is required in external sidebar.json entries")
      )
    })

    it("Throws error if local item doesn't have slug field", () => {
      const rawData = [{}]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)

      expect(() => require('./sidebar')).toThrow(
        new Error("'slug' field is required in local sidebar.json entries")
      )
    })

    // eslint-disable-next-line max-len
    it("Throws error if item has source: false and doesn't have children", () => {
      const rawData = [{ slug: 'item-name', source: false }]

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)

      expect(() => require('./sidebar')).toThrow(
        new Error(
          'Local sidebar.json entries with no source must have children'
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
        source: '/docs/item-name.md',
        tutorials: {},
        prev: undefined,
        next: undefined
      }

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const { getItemByPath } = require('./sidebar')

      expect(getItemByPath('/doc')).toEqual(result)
    })

    // eslint-disable-next-line max-len
    it('Returns first child with source for all parents with source:false', () => {
      const rawData = [
        {
          slug: 'item',
          source: false,
          children: [
            {
              slug: 'nested',
              source: false,
              children: [
                {
                  slug: 'subnested',
                  source: false,
                  children: ['leaf-item']
                }
              ]
            }
          ]
        }
      ]
      const result = {
        label: 'Leaf Item',
        path: '/doc/item/nested/subnested/leaf-item',
        source: '/docs/item/nested/subnested/leaf-item.md',
        tutorials: {},
        prev: undefined,
        next: undefined
      }

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const { getItemByPath } = require('./sidebar')

      expect(getItemByPath('/doc/item')).toEqual(result)
      expect(getItemByPath('/doc/item/nested')).toEqual(result)
      expect(getItemByPath('/doc/item/nested/subnested')).toEqual(result)
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

      jest.doMock('../../../content/docs/sidebar.json', () => rawData)
      const { getParentsListFromPath } = require('./sidebar')

      expect(getParentsListFromPath(path)).toEqual(result)
    })
  })
})
