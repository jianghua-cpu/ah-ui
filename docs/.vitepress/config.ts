import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ah UI',
  description: '基于 Element Plus 封装的业务组件库',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/table' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '导入方式', link: '/guide/import' }
          ]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Form 表单', link: '/components/form' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jianghua-cpu/ah-ui' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    }
  }
})
