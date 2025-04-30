<script setup lang="ts">
import { columns } from '@/components/restaurants/columns';
import DataTable from '@/components/restaurants/data-table.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Restaurant, type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, usePage, router } from '@inertiajs/vue3';
import { ref } from 'vue';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Restaurants',
        href: '/restaurants',
    },
];

const page = usePage<SharedData>();
const user = page.props.auth.user as User;

// Handle paginated data
const paginatedData = ref(page.props.restaurants); // Full pagination object
const data = ref<Restaurant[]>(paginatedData.value.data); // Extract the actual data (items)

// Pagination metadata
const currentPage = ref(paginatedData.value.current_page);
const lastPage = ref(paginatedData.value.last_page);

// Handle page change
function fetchPage(page: number) {
    // Use Inertia to fetch the new page
    router.get(
        '/restaurants',
        { page },
        {
            preserveState: true,
            preserveScroll: true,
            onSuccess: ({ props }) => {
                paginatedData.value = props.restaurants;
                data.value = paginatedData.value.data;
                currentPage.value = paginatedData.value.current_page;
                lastPage.value = paginatedData.value.last_page;
            },
        },
    );
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Restaurants List" />

        <div class="container mx-auto py-10">
            <DataTable :columns="columns" :data="data" :current-page="currentPage" :last-page="lastPage" :fetch-page="fetchPage" />
        </div>
    </AppLayout>
</template>
