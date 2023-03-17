import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
    const id = Number(params.id);
    if(!isNaN(id)){
        const response = await fetch("/api/admin/board/detail/"+id);
        const item = await response.json();
        if(item.success == true){
            return {
                item
            };
        }else{
            throw error(404, {
                message: item.error.message
            });    
        }
    } else{
        throw error(404, {
            message: 'Not found'
        });
    }
}) satisfies PageLoad;