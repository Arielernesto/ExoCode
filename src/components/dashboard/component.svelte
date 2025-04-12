<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { Activity, BarChart3, Bell, Calendar, CreditCard, DollarSign, Download, Home, Inbox, Menu, Package, Search, Settings, Users, X, Plus } from 'lucide-svelte';

  // Importa los componentes UI
  import { Button } from 'lib/components/ui/button';
  import * as Card from 'lib/components/ui/card';
  import { Input } from 'lib/components/ui/input';
  import * as Avatar from 'lib/components/ui/avatar';
  import { Badge } from 'lib/components/ui/badge';
  import { Progress } from 'lib/components/ui/progress';
  import * as Tabs from 'lib/components/ui/tabs';
  import * as DropdownMenu from 'lib/components/ui/dropdown-menu';

  let isSidebarOpen = true;
  let isLoaded = $state(false);
  let progress = 13;
  let activeTab = $state("active");

  function toggleSidebar() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isSidebarOpen) {
      isSidebarOpen = false;
    } else {
      isSidebarOpen = !isSidebarOpen;
    }
  }

  onMount(() => {
    const timer = setTimeout(() => {
      isLoaded = true;
    }, 500);

    let start;
    let animationFrameId;

    function animateProgress(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      progress = Math.min(13 + elapsed / 50, 100);

      if (progress < 100) {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    }

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });

  const stats = [
    { title: "Total Revenue", icon: DollarSign, value: "$45,231.89", change: "+20.1% from last month", color: "purple-600" },
    { title: "New Customers", icon: Users, value: "+2,350", change: "+18.2% from last month", color: "purple-500" },
    { title: "Active Now", icon: Activity, value: "+573", change: "+201 since last hour", color: "purple-400" },
    { title: "Sales", icon: BarChart3, value: "+12,234", change: "+19% from last month", color: "purple-300" },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Created a new project", time: "2 minutes ago" },
    { user: "Sarah Smith", action: "Completed task", time: "1 hour ago" },
    { user: "Alex Johnson", action: "Added new client", time: "3 hours ago" },
    { user: "Emily Davis", action: "Updated dashboard", time: "5 hours ago" },
    { user: "Michael Brown", action: "Closed ticket #1234", time: "Yesterday" },
  ];

  const projects = [
    { name: "Website Redesign", progress: 75, status: "On Track" },
    { name: "Mobile App Development", progress: 32, status: "At Risk" },
    { name: "Marketing Campaign", progress: 58, status: "On Track" },
    { name: "Product Launch", progress: 16, status: "Delayed" },
  ];
</script>

<div class="min-h-screen bg-white">
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    {#if isSidebarOpen}
      <aside transition:fly={{ x: -280, duration: 300 }} class="fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r bg-white lg:static">
        <div class="flex h-14 items-center justify-between border-b px-4">
          <div class="flex items-center gap-2 font-semibold text-lg">
            <div class="h-6 w-6 rounded-full bg-purple-600"></div>
            <span>Dashboard</span>
          </div>
          <Button variant="ghost" size="icon" on:click={toggleSidebar} class="lg:hidden" aria-label="Close Sidebar">
            <X class="h-5 w-5" />
          </Button>
        </div>
        <nav class="flex-1 overflow-auto py-4">
          <div class="px-3">
            <h2 class="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Main</h2>
            <div class="space-y-1">
              <Button variant="ghost" class="w-full justify-start gap-2 text-purple-600">
                <Home class="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <Inbox class="h-4 w-4" />
                Inbox
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <Package class="h-4 w-4" />
                Proyectos
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <Users class="h-4 w-4" />
                Tareas
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <CreditCard class="h-4 w-4" />
                Billing
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <Calendar class="h-4 w-4" />
                Calendario
              </Button>
            </div>
            <h2 class="mt-6 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Configuración
            </h2>
            <div class="space-y-1">
              <Button variant="ghost" class="w-full justify-start gap-2">
                <Settings class="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </nav>
        <div class="border-t p-4">
          <div class="flex items-center gap-3">
            <Avatar.Root class="hidden md:flex">
              <!-- <Avatar.Image src="" alt="@shadcn" /> -->
              <Avatar.Fallback class="bg-gray-200">{"A"}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-col">
              <span class="text-sm font-medium">John Doe</span>
              <span class="text-xs text-gray-500">john@example.com</span>
            </div>
          </div>
        </div>
      </aside>
      <div transition:fade={{ duration: 300 }} class="fixed inset-0 z-40 bg-black/50 lg:hidden" on:click={toggleSidebar} aria-hidden="true"></div>
    {/if}

    <!-- Main Content -->
    <main class="flex-1 overflow-auto" role="main" aria-label="Dashboard content">
      <!-- Header -->
      <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" on:click={toggleSidebar} class="lg:hidden" aria-label="Toggle Sidebar">
            <Menu class="h-5 w-5" />
          </Button>
          <div class="w-full flex-1 md:max-w-sm">
            <form>
              <div class="relative">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search..." class="w-full rounded-lg bg-white pl-8 shadow-none md:w-[240px] lg:w-[280px]" />
              </div>
            </form>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" class="relative" aria-label="Notifications">
            <Bell class="h-5 w-5" />
            <Badge class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-purple-600">3</Badge>
          </Button>
          <!-- <DropdownMenu>
            DropdownMenu content
          </DropdownMenu> -->
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="p-4 sm:p-6 lg:p-8">
        <div class="flex flex-col gap-4 md:gap-8">
          <div class="flex flex-col gap-2">
            <Card.Title  class="text-2xl font-bold tracking-tight">Dashboard</Card.Title>
            <Card.Description class="text-gray-500">Welcome back, here's what's happening with your business today.</Card.Description>
          </div>

          <!-- Stats Cards -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {#if isLoaded}
              {#each stats as stat, index}
                <div in:fly={{ y: 20, duration: 300, delay: index * 100 }}>
                  <Card.Root class="overflow-hidden border-l-4 border-l-{stat.color}">
                    <Card.Header class="flex flex-row items-center justify-between">
                      <Card.Title class="text-sm font-medium">{stat.title}</Card.Title>
                      <svelte:component this={stat.icon} class="h-4 w-4 text-gray-500" />
                    </Card.Header>
                    <Card.Content class="p-[1rem]">
                      <div class="text-2xl font-bold">{stat.value}</div>
                      <p class="text-xs text-green-500">{stat.change}</p>
                    </Card.Content>
                  </Card.Root>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Charts and Tables -->
          <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <Card.Root class="col-span-full lg:col-span-4">
              <Card.Header>
              <Card.Title>Performance Overview</Card.Title>
              <Card.Description>Monthly revenue and sales statistics</Card.Description>
              </Card.Header>
              <Card.Content class="h-[300px] w-full">
                {#if isLoaded}
                  <div in:fade={{ duration: 500 }} class="flex h-full flex-col justify-between">
                    <div class="flex h-[240px] items-end gap-2">
                      {#each [40, 30, 70, 50, 90, 60, 55, 80, 45, 60, 70, 75] as height, i}
                        <div class="relative flex-1 rounded-t bg-purple-600" style="height: {height}%;" in:fly={{ y: 100, duration: 500, delay: i * 50 }}>
                          <div class="absolute -top-7 w-full text-center text-xs font-medium">
                            ${Math.floor(height * 100)}
                          </div>
                        </div>
                      {/each}
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 overflow-x-auto pb-2">
                      {#each ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as month}
                        <div>{month}</div>
                      {/each}
                    </div>
                  </div>
                {:else}
                  <div class="flex h-full items-center justify-center">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  </div>
                {/if}
              </Card.Content>
              <Card.Footer class="flex flex-col sm:flex-row gap-2 justify-between">
                <Button variant="outline" size="sm">
                  <Download class="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Card.Footer>
            </Card.Root>

            <Card.Root class="col-span-full lg:col-span-3">
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>Your team's latest actions</Card.Description>
              </Card.Header>

              <Card.Content class="space-y-4">
                {#if isLoaded}
                  {#each recentActivity as item, i}
                    <div in:fly={{ x: -20, duration: 300, delay: i * 100 }} class="flex items-center gap-4 rounded-lg border p-3">
                      <Avatar.Root class="hidden md:flex">
                        <!-- <Avatar.Image src="" alt="@shadcn" /> -->
                        <Avatar.Fallback class="bg-gray-200">{"A"}</Avatar.Fallback>
                      </Avatar.Root>
                      <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium leading-none">{item.user}</p>
                        <p class="text-sm text-gray-500">{item.action}</p>
                      </div>
                      <div class="text-xs text-gray-500">{item.time}</div>
                    </div>
                  {/each}
                {:else}
                  <div class="flex h-[300px] items-center justify-center">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  </div>
                {/if}
              </Card.Content>
              <Button variant="default" class="w-full">View All Activity</Button>
            </Card.Root>
          </div>

          <!-- Projects Section -->
          <div class="mt-8">
            <Tabs.Root bind:value={() => activeTab, (newValue) => (activeTab = newValue)}>
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div class="grid w-full sm:w-auto grid-cols-3">
                  <Button variant={activeTab === 'active' ? 'default' : 'ghost'} on:click={() => activeTab = 'active'}>Active</Button>
                  <Button variant={activeTab === 'completed' ? 'default' : 'ghost'} on:click={() => activeTab = 'completed'}>Completed</Button>
                  <Button variant={activeTab === 'archived' ? 'default' : 'ghost'} on:click={() => activeTab = 'archived'}>Archived</Button>
                </div>
                <Button size="sm" class="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  <Plus class="mr-2 h-4 w-4" />
                  <span>New Project</span>
                </Button>
              </div>
              
              {#if activeTab === 'active'}
                <Card.Root>
                  <div class="divide-y">
                    {#if isLoaded}
                      {#each projects as project, i}
                        <div in:fly={{ y: 20, duration: 300, delay: i * 100 }} class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
                          <div class="flex-1 space-y-2">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <p class="text-sm font-medium">{project.name}</p>
                              <Badge class={project.status === "On Track" ? "bg-green-500" : project.status === "At Risk" ? "bg-yellow-500" : "bg-red-500"}>
                                {project.status}
                              </Badge>
                            </div>
                            <div class="flex items-center gap-2">
                              <Progress value={project.progress} class="h-2 flex-1" />
                              <span class="text-xs text-gray-500 whitespace-nowrap">{project.progress}%</span>
                            </div>
                          </div>
                        </div>
                      {/each}
                    {:else}
                      <div class="flex h-[200px] items-center justify-center">
                        <div class="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                      </div>
                    {/if}
                  </div>
                </Card.Root>
              {:else if activeTab === 'completed'}
                <Card.Root>
                  <div class="flex h-[200px] flex-col items-center justify-center text-center">
                    <Package class="h-10 w-10 text-gray-400" />
                    <h3 class="mt-4 text-lg font-medium">No completed projects</h3>
                    <p class="mt-2 text-sm text-gray-500">When you complete projects, they will appear here.</p>
                  </div>
                </Card.Root>
              {:else if activeTab === 'archived'}
                <Card.Root>
                  <div class="flex h-[200px] flex-col items-center justify-center text-center">
                    <Package class="h-10 w-10 text-gray-400" />
                    <h3 class="mt-4 text-lg font-medium">No archived projects</h3>
                    <p class="mt-2 text-sm text-gray-500">Archived projects will be stored here for reference.</p>
                  </div>
                </Card.Root>
              {/if}
            </Tabs.Root>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  /* You can add Svelte-specific styles here if needed */
</style>

