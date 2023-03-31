<script lang="ts">
    import axios from 'axios';
    import Swal from "sweetalert2";
    import { extractErrors, attendanceValidateSchema } from '$utils/validates';
    import { paginate, LightPaginationNav, DarkPaginationNav } from 'svelte-paginate'
    import { onMount } from 'svelte';
    import { auth, authToken, isDark } from '$stores';
    import { goto } from '$app/navigation';

    let paginatedItems:any;
    let currentPage = 1
    let pageSize:number = 10

    let attendanceList:any;
    let items;

    let addValues:any={
        content:''
    };

    let errors:any = {};

    onMount(async () => {
      await fetch("/api/user/attendance")
            .then(response => response.json())
            .then(item => {
              attendanceList = item.response;
              console.log(attendanceList)
            })
            .catch(error => console.log(error));
    });

    $:if(attendanceList){
      items = attendanceList.content;
      paginatedItems = paginate({ items, pageSize, currentPage});
    }


    const submitAttendance = async () => {
        try {
            addValues.userId = Number($auth._id);
            await attendanceValidateSchema.validate(addValues, {abortEarly: false});
            await onAddAttendance();
        } catch (error) {
            errors = extractErrors(error);
        }
    }

    const onAddAttendance = async () => {
        try {
            const response = await axios.post("/api/user/attendance/create", addValues);
            if(response.status == 200){
                //notyf.success("생성되었습니다.");
                location.reload()
            }else{
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    text: "에러가 발생했습니다. 관리자에게 문의해주세요.",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
            }
        } catch(error) {
            console.log(error)
            if(error){
              if(error.response.status == 400){
                if(error.response.data.resultCode ==1100){
                  Swal.fire({
                    icon: 'error',
                    text: error.response.data.resultMsg,
                    timer: 3000, // 3초 후 자동으로 닫힘
                  });
                }
              } else if(error.response.status == 401){
                  goto("/login");
              }
            }
        }
    }


    const dateFommater = (date:Array<number>):string => {
        const yyyy = date[0];
        const MM = date[1];
        const dd = date[2];
        const HH = date[3];
        const mm = date[4];
        const ss = date[5];

        return yyyy+"-"+MM+"-"+dd+" "+HH+":"+mm+":"+ss;

    }

</script>
<div class="md:mx-24">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">출석하기</h3>
            </div>
            <div class="space-y-1">
                <input
                    type="text"
                    id="content"
                    placeholder="내용을 입력해주세요."
                    class="block w-full h-16 md:h-20 appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20"
                    maxlength="100"
                    name="content"
                    class:border-red-500={errors.content}
                    bind:value={addValues.content}
                     />
                {#if errors.content}
                    <div class="text-red-500">{errors.content}</div>
                {/if}
                {#if $authToken}
                <div class="flex justify-end">
                    <button 
                    type="submit" 
                    class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600"
                    on:click={() => submitAttendance()}
                    >출석하기</button>
                </div>
                {/if}
                    <div class="w-full overflow-x-auto scroll">
                      <table class="table-auto w-full p-6 mt-2 text-xs text-left whitespace-nowrap">
                        <thead>
                          <!-- <tr>
                            <th class="px-4 py-2"></th>
                            <th class="px-4 py-2 "></th>
                            <th class="px-4 py-2"></th>
                          </tr> -->
                        </thead>
                        <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {#if paginatedItems}
                          {#each paginatedItems as data, index}
                          <tr class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                            <td class="px-4 py-3 w-1/12">
                              <div class="flex items-center text-sm">
                                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                  <img class="object-cover w-full h-full rounded-full" src="/dummy-avatar.jpg" alt="" loading="lazy">
                                  <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                </div>
                                <div class="flex items-center">
                                  {#if index == 0}
                                  <span class="text-xs mr-2 p-0.5 px-1.5 text-yellow-300 border border-yellow-300 rounded-full">★ 1등</span>
                                  {:else if index == 1}
                                  <span class="text-xs mr-2 p-0.5 px-1.5 text-gray-300 border border-gray-300 rounded-full">★ 2등</span>
                                  {:else if index == 2}
                                  <span class="text-xs mr-2 p-0.5 px-1.5 text-amber-800 border border-amber-800 rounded-full">★ 3등</span>
                                  {/if}
                                  <p class="font-semibold text-xs">{data.writer.nickName}</p>
                                </div>
                              </div>
                            </td>
                            <td class="px-4 py-3 text-sm w-8/12"><p class="w-16 md:w-72 lg:w-96 text-xs overflow-ellipsis overflow-hidden">{data.content}</p></td>
                            <td class="px-4 py-3 text-xs text-gray-400 w-2/12">{dateFommater(data.createDate)}</td>
                          </tr>
                          {/each}
                        {/if}
                        </tbody>
                      </table>
                    </div>
                    <!-- Pagination -->
                    {#if $isDark}
                      {#if attendanceList && attendanceList.totalElements > 0}
                        <DarkPaginationNav
                          totalItems="{attendanceList.totalElements}"
                          pageSize="{pageSize}"
                          currentPage="{currentPage}"
                          limit="{1}"
                          showStepOptions="{true}"
                          on:setPage="{(e) => currentPage = e.detail.page}"
                        />
                      {/if}
                      {:else}
                      {#if attendanceList && attendanceList.totalElements > 0}
                        <LightPaginationNav
                          totalItems="{attendanceList.totalElements}"
                          pageSize="{pageSize}"
                          currentPage="{currentPage}"
                          limit="{1}"
                          showStepOptions="{true}"
                          on:setPage="{(e) => currentPage = e.detail.page}"
                        />
                      {/if}
                    {/if}
                  </div>
        </div>
    </div>
</div>
