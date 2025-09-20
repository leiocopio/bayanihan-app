<script>
    import { page } from '$app/stores';
    import { Icon } from 'svelte-icons-pack';
    import { IoHome } from "svelte-icons-pack/io";
    import { FaSolidLocationPin, FaSolidCalendar, FaSolidUser, FaSolidBell } from "svelte-icons-pack/fa";
  </script>
  
  <nav class="px-1">
    <li>
      <a href="/maps" class={$page.url.pathname === '/maps' ? 'bg-green-800 rounded-full p-3' : ''}>
        <Icon
          src={FaSolidLocationPin}
          size={24}
          color={$page.url.pathname === '/maps' ? 'white' : 'black'}
        />
      </a>

    </li>
  
    <li>
      <a href="/collections" class={$page.url.pathname === '/collections' ? 'bg-green-800 rounded-full p-3' : ''}>
        <Icon
          src={FaSolidCalendar}
          size={24}
          color={$page.url.pathname === '/collections' ? 'white' : 'black'}
        />
      </a>

    </li>
    <li>
      <a href="/" class={$page.url.pathname === '/' ? 'bg-green-800 rounded-full p-3' : ''}>
        <Icon
          src={IoHome}
          size={24}
          color={$page.url.pathname === '/' ? 'white' : 'black'}
        />
      </a>

    </li>
    
    <li>
      <a href="/user" class={$page.url.pathname === '/user' ? 'bg-green-800 rounded-full p-3' : ''}>
        <Icon
          src={FaSolidUser}
          size={24}
          color={$page.url.pathname === '/user' ? 'white' : 'black'}
        />
      </a>

    </li>
  
    <li>
      <a href="/notif" class={$page.url.pathname === '/notif' ? 'bg-green-800 rounded-full p-3' : ''}>
        <Icon
          src={FaSolidBell}
          size={24}
          color={$page.url.pathname === '/notif' ? 'white' : 'black'}
        />
      </a>

    </li>
  </nav>
  

<style>

     
    nav{
        display: grid;
        justify-items: center;
        align-items: center;
        grid-template-columns: repeat(5, 1fr);
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