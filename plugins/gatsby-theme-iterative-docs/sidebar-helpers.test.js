const normalizeSidebar = require('./normalize-sidebar')
const { getItemByPath, getParentsListFromPath } = require('./sidebar-helpers')

describe('SidebarMenu/helper', () => {
  describe('getItemByPath', () => {
    it('Returns first child for the /doc path', () => {
      const sidebar = normalizeSidebar(['item-name'])
      const result = {
        label: 'Item Name',
        path: '/doc/item-name',
        source: '/docs/item-name.md',
        tutorials: {},
        prev: undefined,
        next: undefined
      }

      expect(getItemByPath(sidebar, '/doc')).toEqual(result)
    })

    // eslint-disable-next-line max-len
    it('Returns first child with source for all parents with source:false', () => {
      const sidebar = normalizeSidebar([
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
      ])
      const result = {
        label: 'Leaf Item',
        path: '/doc/item/nested/subnested/leaf-item',
        source: '/docs/item/nested/subnested/leaf-item.md',
        tutorials: {},
        prev: undefined,
        next: undefined
      }

      expect(getItemByPath(sidebar, '/doc/item')).toEqual(result)
      expect(getItemByPath(sidebar, '/doc/item/nested')).toEqual(result)
      expect(getItemByPath(sidebar, '/doc/item/nested/subnested')).toEqual(
        result
      )
    })
  })

  describe('getParentsListFromPath', () => {
    it("Returns array of current and parent's paths", () => {
      const path = '/doc/item-name/nested-item/subnested-item'
      const result = [
        '/doc/item-name',
        '/doc/item-name/nested-item',
        '/doc/item-name/nested-item/subnested-item'
      ]

      expect(getParentsListFromPath(path)).toEqual(result)
    })
  })
})
