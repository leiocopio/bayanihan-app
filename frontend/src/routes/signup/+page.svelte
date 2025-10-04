<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    // Assuming 'select-philippines-address' is installed and correct
    import { regions, provinces, cities, barangays } from "select-philippines-address";
    import { supabase } from "$lib/supabaseClient"; // ✅ direct Supabase client

    // Form fields
    let first_name = "";
    let last_name = "";
    let email = "";
    let pass = "";
    let confirm_pass = "";
    let contact_number = "";
    let address_street = "";

    // Address codes (These hold the raw codes from the selection)
    let address_region = "";
    let address_province = "";
    let address_city = "";
    let address_bgy = "";

    // Address options
    let regionOptions = [];
    let provinceOptions = [];
    let cityOptions = [];
    let barangayOptions = [];

    let userType = ""; // Binds to the Select User Type dropdown

    let errorMessage = "";

    onMount(async () => {
        regionOptions = await regions();
    });

    // --- Address Handlers (Logic remains correct for fetching data based on codes) ---
    async function handleRegionChange(e) {
        address_region = e.target.value;
        address_province = "";
        address_city = "";
        address_bgy = "";
        provinceOptions = [];
        cityOptions = [];
        barangayOptions = [];

        if (address_region) {
            provinceOptions = await provinces(address_region);
        }
    }

    async function handleProvinceChange(e) {
        address_province = e.target.value;
        address_city = "";
        address_bgy = "";
        cityOptions = [];
        barangayOptions = [];

        if (address_province) {
            cityOptions = await cities(address_province);
        }
    }

    async function handleCityChange(e) {
        address_city = e.target.value;
        address_bgy = "";
        barangayOptions = [];

        if (address_city) {
            barangayOptions = await barangays(address_city);
        }
    }

    function handleBarangayChange(e) {
        address_bgy = e.target.value;
    }

    // ✅ Direct Supabase Signup
    async function handleSignup() {
        if (pass !== confirm_pass) {
            errorMessage = "Passwords do not match";
            return;
        }

		if (!pass || pass.length < 8) {
			errorMessage = "Password must be at least 8 characters long.";
			return;
		}
        if (!userType) {
            errorMessage = "Please select a User Type.";
            return;
        }
        
        try {
            // Map codes to names before insertion (required because the DB stores names)
            const regionName =
                regionOptions.find((r) => r.region_code === address_region)?.region_name || "";
            const provinceName =
                provinceOptions.find((p) => p.province_code === address_province)?.province_name ||
                "";
            const cityName =
                cityOptions.find((c) => c.city_code === address_city)?.city_name || "";
            const barangayName =
                barangayOptions.find((b) => b.brgy_code === address_bgy)?.brgy_name || "";

            let authUserId = null;
            let dbError = null;

            // 1. Attempt to create auth user
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password: pass,
            });

            if (signUpError) {
                // --- RESILIENCE LOGIC TO HANDLE EXISTING AUTH USER WITH MISSING PROFILE ---
                if (signUpError.message.includes("already registered")) {
                    // User already exists in auth.users, try to sign them in.
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password: pass,
                    });

                    if (signInError) {
                        // User exists, but credentials don't match or email is not confirmed
                        errorMessage = "Email already registered. Please check your credentials or log in separately.";
                        return;
                    }
                    
                    authUserId = signInData.user.id;
                    // Proceed to step 2 (Profile creation/check) below.

                } else {
                    // Handle other signup errors (e.g., bad format, etc.)
                    errorMessage = signUpError.message;
                    return;
                }
            } else {
                // Successful initial signup
                authUserId = signUpData.user.id;
            }
            
            // Validate if authUserId is available before proceeding
            if (!authUserId) {
                errorMessage = "Authentication failed to retrieve user ID.";
                return;
            }

            // 2. Check if profile already exists. If not, insert it.
            const { data: profileData, error: fetchError } = await supabase
                .from("users")
                .select("id")
                .eq("id", authUserId)
                .maybeSingle();
                
            if (fetchError) {
                errorMessage = "Error checking profile existence: " + fetchError.message;
                return;
            }
            
            if (profileData) {
                // Profile exists, treat as success and redirect
                goto("/home");
                return;
            }

            // Profile is missing, proceed with insertion
            const { error: insertError } = await supabase.from("users").insert({
                id: authUserId, // Use the retrieved/newly created user ID
                first_name,
                last_name,
                email,
                contact_number,
                address_street,
                address_region: regionName,
                address_province: provinceName,
                address_city: cityName,
                address_bgy: barangayName,
                user_type: userType // User type added successfully
            });
            
            dbError = insertError;

            if (dbError) {
                errorMessage = "Database Insertion Error: " + dbError.message;
                return;
            }

            // ✅ Success → redirect
            goto("/home");
        } catch (err) {
            errorMessage = "Unexpected error: " + err.message;
        }
    }
</script>

<div class="mx-auto max-w-md p-4">
    <h1 class="mb-4 text-2xl font-bold">Sign Up</h1>

    {#if errorMessage}
        <div class="rounded-lg bg-red-100 p-3 text-red-600 shadow">
            <strong>Error:</strong> {errorMessage}
        </div>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="flex flex-col gap-3 mt-4">
        <input type="text" bind:value={first_name} placeholder="First Name" class="input" required />
        <input type="text" bind:value={last_name} placeholder="Last Name" class="input" required />
        <input type="email" bind:value={email} placeholder="Email" class="input" required />
        <input type="password" bind:value={pass} placeholder="Password" class="input" required />
        <div>
            <input
                type="password"
                bind:value={confirm_pass}
                placeholder="Confirm Password"
                class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
            />
            {#if confirm_pass && pass !== confirm_pass}
                <p class="text-sm text-red-600 mt-1">Passwords do not match</p>
            {/if}
        </div>
        <input
            type="text"
            bind:value={contact_number}
            placeholder="Contact Number"
            class="input"
            required
        />
        
        <!-- ✅ User Type Select Field -->
        <select bind:value={userType} class="input" required>
            <option value="" disabled selected>Select User Type</option>
            <option value="User">User</option>
            <option value="Collector">Collector</option>
        </select>
        
        <input type="text" bind:value={address_street} placeholder="Street" class="input" required />

        <!-- Region -->
        <select class="input" on:change={handleRegionChange} required>
            <option value="">Select Region</option>
            {#each regionOptions as r}
                <option value={r.region_code}>{r.region_name}</option>
            {/each}
        </select>

        <select class="input" on:change={handleProvinceChange} required>
            <option value="">Select Province</option>
            {#each provinceOptions as p}
                <option value={p.province_code}>{p.province_name}</option>
            {/each}
        </select>

        <select class="input" on:change={handleCityChange} required>
            <option value="">Select City</option>
            {#each cityOptions as c}
                <option value={c.city_code}>{c.city_name}</option>
            {/each}
        </select>

        <select class="input" on:change={handleBarangayChange} required>
            <option value="">Select Barangay</option>
            {#each barangayOptions as b}
                <option value={b.brgy_code}>{b.brgy_name}</option>
            {/each}
        </select>

        <button type="submit" class="mt-4 rounded bg-green-600 px-4 py-3 text-white font-semibold shadow-md hover:bg-green-700 transition duration-150">
            Sign Up
        </button>
    </form>
</div>

<style>
    .input {
        border: 1px solid #ccc;
        padding: 0.75rem; /* Increased padding */
        border-radius: 0.5rem; /* More rounded corners */
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    .input:focus {
        border-color: #34d399; /* Tailwind green-400 equivalent */
        box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.5); /* Focus ring */
    }
</style>
