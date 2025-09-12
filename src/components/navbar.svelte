
<script>
    import { Icon } from 'svelte-icons-pack';
    import { FaSolidCalendar } from "svelte-icons-pack/fa";
    import { FaSolidBell } from "svelte-icons-pack/fa";
    import { HiSolidMapPin } from "svelte-icons-pack/hi";
    import { FaSolidUser } from "svelte-icons-pack/fa";

    
</script>
<nav>
    <li><a href="/maps">
        <Icon src={HiSolidMapPin} /></a></li> <!-- location button -->
    <li><a href="/collections"><Icon src={FaSolidCalendar} /></a></li> <!-- claendar button  -->
    <li><a href="/user"><Icon src={FaSolidUser} /></a></li> <!-- user button -->
    <li><a href="/notif"><Icon src={FaSolidBell} /></a></li> <!-- notif button -->

</nav>

<style>
    nav{
        

        display: grid;
        justify-items: center;
        align-items: center;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;

        height: 56px;
        width: 100vw;
        box-shadow: 0px -12px 75px -3px rgba(0,0,0,0.32);

		position: fixed;
		bottom: 0;
		left: 0;
        z-index:0;

        background-color: white;

        li{
            list-style: none;
        }

    }
</style>