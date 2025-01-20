import { unreadcount } from "store/store"
let count = [];
unreadcount.subscribe((value)=>{
    count=value;
})
const CleanCount = (user)=>{
count.forEach((ct)=>{
    if(ct.chatId===user.id){
        ct.count=0;
    }

})
unreadcount.update(()=>{
    return count;
});
count=[];
}
export default CleanCount;