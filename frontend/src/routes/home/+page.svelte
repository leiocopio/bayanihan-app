<div class="mx-2 my-4">
  <p class="text-2xl font-bold mb-4">
    Welcome back!
  </p>
  <br>

  <div id="selection" class="mx-2 flex flex-col justify-center">
    <li>
      <a href="/maps" class="block w-full h-full">
        Check nearby trucks
      </a>
    </li>
    <li>
      <a href="/collections" class="block w-full h-full">
        Check collections schedule
      </a>
    </li>
  </div>
</div>

<style>
  #selection > li {
    list-style: none;
    height: 5rem;
    background-color: green;
    border-radius: 10px;
    margin-bottom: 1rem;
    padding: 1rem;
    display: flex;
    align-items: center; /* center text vertically */
  }

  #selection > li > a {
    display: block; /* makes link fill the whole li */
    width: 100%;
    height: 100%;
    color: white;
    text-decoration: none;
    font-size: 1rem;
  }
</style>
