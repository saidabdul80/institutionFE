<template>
    <div class="mt-10">
        <div class=" rounded-lg w-[80%] mx-auto">
            <h2 class="text-[red] text-2xl mb-3">Application Announcements</h2>
            <div class="text-[black]">
                <p class="text-lg">Candidates who chose to apply to {NIIMA College of Health Technologies, Minna}, with Unified Tertiary Matriculation Examination (UTME) and Direct Entry (DE) are hereby invited to the Screening Exercise. The following conditions apply:</p>
                <ul class="text-md text-[blue]">
                    <li>- UTME candidates must have scored a minimum of 160 in their UTME</li>
                    <li>- Direct Entry candidates must be holders of OND/HND/First Degree and A'Level in relevant disciplines and subjects.</li>
                    <li>- Those who did not choose FUTO as their First Choice University but scored a minimum of 160 can also apply on the condition that they visit the JAMB website for a change of Institution to FUTO as their First Choice University.</li>
                </ul>
                <p class="flex items-center text-md"><span>Application commences on September 1, 2023 and closes on September 30, 2023</span> <Button label="More..." severity="secondary" link /></p>
            </div>
            <div class="mt-3 p-0"><Button class="m-0 p-0" severity="secondary" link label="Apply Now"  /></div>
            <div class="m-0 p-0"><Button class="m-0 p-0" severity="secondary" link label="Download Application Form"  />        </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
export default {
    name: 'Announcement',
  components: {    
    Button,
    
  },
    
}
</script>
<style scoped>
ul {
    padding:10px 25px;
}
ul li{
    margin:10px 0px;
}
</style>