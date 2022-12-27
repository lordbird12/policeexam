/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        title: 'ภาพรวมผลการสอบ1',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ผลการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/dashboards/member',
            },
        ],
    },

    {
        title: 'ข้อมูลรายการสอบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ลงทะเบียนการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/exam/list',
            },
            {
                title: 'รายการที่ต้องสอบ',
                type: 'basic',
                icon: 'heroicons_outline:light-bulb',
                link: '/exam/exam-todo',
            },
            {
                title: 'รายการประวัติการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:badge-check',
                link: '/exam/exam-history',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        title: 'ภาพรวมผลการสอบ2',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ผลการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/dashboards/member',
            },
        ],
    },

    {
        title: 'ข้อมูลรายการสอบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ลงทะเบียนการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/exam/list',
            },
            {
                title: 'รายการที่ต้องสอบ',
                type: 'basic',
                icon: 'heroicons_outline:light-bulb',
                link: '/exam/exam-todo',
            },
            {
                title: 'รายการประวัติการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:badge-check',
                link: '/exam/exam-history',
            },
        ],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        title: 'ภาพรวมผลการสอบ3',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ผลการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/dashboards/member',
            },
        ],
    },

    {
        title: 'ข้อมูลรายการสอบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                title: 'ลงทะเบียนการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/exam/list',
            },
            {
                title: 'รายการที่ต้องสอบ',
                type: 'basic',
                icon: 'heroicons_outline:light-bulb',
                link: '/exam/exam-todo',
            },
            {
                title: 'รายการประวัติการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:badge-check',
                link: '/exam/exam-history',
            },
        ],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'sammary',
        title: 'ภาพรวมผลการสอบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'sammary-exam',
                title: 'ผลการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/dashboards/member',
            },
        ],
    },
    {
        id: 'exam',
        title: 'ข้อมูลรายการสอบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'exam-register',
                title: 'ลงทะเบียนการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/exam/list',
            },
            {
                id: 'exam-order',
                title: 'รายการที่ต้องสอบ',
                type: 'basic',
                icon: 'heroicons_outline:light-bulb',
                link: '/exam/exam-todo',
            },
            {
                id: 'exam-history',
                title: 'รายการประวัติการสอบ',
                type: 'basic',
                icon: 'heroicons_outline:badge-check',
                link: '/exam/exam-history',
            },
        ],
    },
    {
        id: 'sample',
        title: 'แนวข้อสอบ',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/sample/list',
    },
    // {
    //     title   : 'เอกสารดาวน์โหลด',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:document-duplicate',
    //     children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id      : 'navigation-features',
    //     title   : 'Misc',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:menu',
    //     children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // }
];
