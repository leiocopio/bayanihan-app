<script>
	import { page } from '$app/stores';
	import { Icon } from 'svelte-icons-pack';
	import { IoHome } from 'svelte-icons-pack/io';
	import {
		FaSolidLocationPin,
		FaSolidCalendar,
		FaSolidUser,
		FaSolidBell
	} from 'svelte-icons-pack/fa';
</script>

<nav
	class={$page.url.pathname === '/' || $page.url.pathname === '/signup'
		? 'hidden'
		: 'gap-y-0; visible grid grid-cols-[repeat(5,1fr)] grid-rows-[1fr] items-center justify-items-center gap-x-0'}
>
	<li>
		<a href="/maps" class={$page.url.pathname === '/maps' ? 'rounded-full bg-green-800 p-3' : ''}>
			<Icon
				src={FaSolidLocationPin}
				size={24}
				color={$page.url.pathname === '/maps' ? 'white' : 'black'}
			/>
		</a>
	</li>

	<li>
		<a
			href="/collections"
			class={$page.url.pathname === '/collections' ? 'rounded-full bg-green-800 p-3' : ''}
		>
			<Icon
				src={FaSolidCalendar}
				size={24}
				color={$page.url.pathname === '/collections' ? 'white' : 'black'}
			/>
		</a>
	</li>
	<li>
		<a href="/home" class={$page.url.pathname === '/home' ? 'rounded-full bg-green-800 p-3' : ''}>
			<Icon src={IoHome} size={24} color={$page.url.pathname === '/home' ? 'white' : 'black'} />
		</a>
	</li>

	<li>
		<a href="/user" class={$page.url.pathname === '/user' ? 'rounded-full bg-green-800 p-3' : ''}>
			<Icon
				src={FaSolidUser}
				size={24}
				color={$page.url.pathname === '/user' ? 'white' : 'black'}
			/>
		</a>
	</li>

	<li>
		<a href="/notif" class={$page.url.pathname === '/notif' ? 'rounded-full bg-green-800 p-3' : ''}>
			<Icon
				src={FaSolidBell}
				size={24}
				color={$page.url.pathname === '/notif' ? 'white' : 'black'}
			/>
		</a>
	</li>
</nav>

<style>
	nav {
		height: 56px;
		width: 100vw;
		box-shadow: 0px -12px 75px -3px rgba(0, 0, 0, 0.32);

		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 0;

		background-color: white;

		li {
			list-style: none;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
