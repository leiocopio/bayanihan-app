<script>
    import { page } from '$app/stores';
    import { Icon } from 'svelte-icons-pack';
    import { FaSolidLocationPin, FaSolidCalendar, FaSolidUser, FaSolidBell } from "svelte-icons-pack/fa";
  </script>
  
  <nav>
    <li>
      <a href="/maps">
        <Icon
          src={FaSolidLocationPin}
          size={24}
          color={$page.url.pathname === '/maps' ? 'green' : 'black'}
        />
      </a>
      <p class="text-center text-sm">Map</p>
    </li>
  
    <li>
      <a href="/collections">
        <Icon
          src={FaSolidCalendar}
          size={24}
          color={$page.url.pathname === '/collections' ? 'green' : 'black'}
        />
      </a>
      <p class="text-center text-sm">Calendar</p>
    </li>
  
    <li>
      <a href="/user">
        <Icon
          src={FaSolidUser}
          size={24}
          color={$page.url.pathname === '/user' ? 'green' : 'black'}
        />
      </a>
      <p class="text-center text-sm">User</p>
    </li>
  
    <li>
      <a href="/notif">
        <Icon
          src={FaSolidBell}
          size={24}
          color={$page.url.pathname === '/notif' ? 'green' : 'black'}
        />
      </a>
      <p class="text-center text-sm">Notifications</p>
    </li>
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
        display: flex
;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        }

    }
</style>