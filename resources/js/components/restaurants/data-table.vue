<script setup lang="ts" generic="TData, TValue">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ColumnDef } from '@tanstack/vue-table';
import { FlexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useVueTable } from '@tanstack/vue-table';
import { ref, watch } from 'vue';
import Button from '../ui/button/Button.vue';
import Input from '../ui/input/Input.vue';

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    currentPage: number; // Current page number
    lastPage: number; // Total number of pages
    fetchPage: (page: number) => void; // Function to fetch a specific page
}>();

const goToPage = ref(props.currentPage);
const sorting = ref<SortingState>([]);

watch(sorting, (newSorting) => {
    console.log('Sorting changed:', newSorting);
    if (newSorting.length > 0) {
        const { id: sortBy, desc } = newSorting[0]; // Extract column and direction
        const sortDirection = desc ? 'desc' : 'asc';
        props.fetchPage(props.currentPage, sortBy, sortDirection); // Fetch data with sorting
    } else {
        props.fetchPage(props.currentPage); // Fetch without sorting
    }
});

const table = useVueTable({
    get data() {
        return props.data;
    },
    get columns() {
        return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updaterOrValue) => (sorting.value = updaterOrValue),
    state: {
        get sorting() {
            return sorting.value;
        },
    },
    getPaginationRowModel: getPaginationRowModel(),
});
</script>

<template>
    <div>
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() ? 'selected' : undefined">
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
        <div class="flex items-center justify-between py-4">
            <div class="flex items-center space-x-2">
                <Button class="btn" :disabled="props.currentPage === 1" @click="props.fetchPage(1)">First</Button>
                <Button class="btn" :disabled="props.currentPage === 1" @click="props.fetchPage(props.currentPage - 1)">Previous</Button>
                <Button
                    v-for="page in Math.min(5, props.lastPage)"
                    :key="page"
                    class="btn"
                    :class="{ 'btn-primary': page === props.currentPage }"
                    @click="props.fetchPage(page)"
                >
                    {{ page }}
                </Button>
                <Button class="btn" :disabled="props.currentPage === props.lastPage" @click="props.fetchPage(props.currentPage + 1)">Next</Button>
                <Button class="btn" :disabled="props.currentPage === props.lastPage" @click="props.fetchPage(props.lastPage)">Last</Button>
            </div>
            <div class="flex items-center space-x-2">
                <Input type="number" v-model="goToPage" class="input" :min="1" :max="props.lastPage" placeholder="Go to page" />
                <Button class="btn" @click="props.fetchPage(goToPage)">Go</Button>
            </div>
        </div>
    </div>
</template>
