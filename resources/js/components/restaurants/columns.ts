import { Restaurant } from '@/types';
import { h } from 'vue';
import { ColumnDef } from '@tanstack/vue-table';
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue';


export const columns: ColumnDef<Restaurant>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Id', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        size: 50,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => h('a', { href: `/restaurants/${row.original.id}` }, row.getValue('name')),
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
];
