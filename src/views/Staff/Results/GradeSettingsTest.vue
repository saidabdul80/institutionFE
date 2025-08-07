<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">
                    Grade Settings Test Page
                </h1>
                <p class="text-gray-600 mb-4">
                    This is a test page to verify routing is working.
                </p>
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    ✅ Component loaded successfully!
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GradeSettingsTest',
    mounted() {
        console.log('GradeSettingsTest component mounted successfully');
    }
}
</script>
