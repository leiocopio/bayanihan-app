<script>
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    // ✅ Import the Calendar Root component directly
    import { Root as CalendarRoot } from '$lib/components/ui/calendar'; 

    let date = new Date();
    let highlightedDates = []; // Array of Date objects for highlighting
    let schedule = [];

    // ✅ 4. Create a reactive store for the modifiers
    // This store links the array of dates to the calendar's styling logic.
    const modifiers = writable({});

    // --- Data Loading and Processing ---

    // Load active schedule from Supabase
    const loadSchedule = async () => {
        const { data, error } = await supabase
            .from('garbage_schedule')
            .select('day_of_week, is_active');

        if (error) {
            console.error('Error loading schedule:', error);
            return;
        }

        schedule = data.filter(d => d.is_active);
        generateHighlightedDates();
    };

    // Convert active weekdays to actual dates for the current month
    const generateHighlightedDates = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const daysMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        };

        let dates = [];
        for (const s of schedule) {
            const weekdayIndex = daysMap[s.day_of_week];
            
            // Loop up to 32 days to safely capture all days of the current month
            for (let day = 1; day <= 32; day++) {
                const d = new Date(year, month, day);
                if (d.getMonth() !== month) break; // Stop when we overflow to the next month
                
                if (d.getDay() === weekdayIndex) {
                    // Push a new Date object to ensure the calendar component can compare them
                    dates.push(new Date(year, month, day));
                }
            }
        }
        
        highlightedDates = dates;

        // ✅ 5. Update the modifiers store
        // 'highlighted' is the key we will map to a CSS class.
        $modifiers = {
            highlighted: highlightedDates
        };
    };

    function gotoSchedule() {
        window.location.href = `/collections/schedule`;
    }

    onMount(async () => {
        await loadSchedule();
    });
</script>

<style>
    /* ✅ 6. Define the custom CSS class for the highlighted dates */
    .highlighted {
        /* You can customize this look using Tailwind/CSS vars */
        background-color: hsl(var(--primary) / 0.1); 
        border: 1px solid hsl(var(--primary));
        color: hsl(var(--primary-foreground));
    }

    .highlighted:not([disabled]):hover {
        background-color: hsl(var(--primary) / 0.2);
    }
</style>

<div class="mx-2 my-4">
    <p class="mb-4 text-center text-2xl font-bold">Calendar</p>
    <p class="mb-4 text-center">Select a date to view the schedule</p>

    <div class="mx-2 flex h-full flex-col items-center justify-center">
        <CalendarRoot
            bind:value={date}
            selected={date}
            
            modifiers={$modifiers}
            
            modifierClassifiers={{
                // ✅ 8. Map the 'highlighted' modifier (from the store) to the 'highlighted' CSS class
                highlighted: 'highlighted' 
            }}
        />

        <button
            class="m-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            on:click={gotoSchedule}
        >
            View Schedule Collection
        </button>
    </div>
</div>