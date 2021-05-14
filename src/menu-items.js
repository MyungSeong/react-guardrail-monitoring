export default {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/',
                    icon: 'feather icon-map',
                }
            ]
        },
        {
            id: 'guardrail-management',
            title: 'Guardrail Management',
            type: 'group',
            icon: 'icon-group',
            children: [
                {
                    id: 'guardrail-setup',
                    title: 'Guardrail Setup',
                    type: 'item',
                    url: '/guardrail/guardrail-setup',
                    icon: 'feather icon-server'
                }
            ]
        }
    ]
}