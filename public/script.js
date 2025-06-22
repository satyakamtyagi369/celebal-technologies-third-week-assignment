document.getElementById('logForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const message = document.getElementById('logInput').value;
    const res = await fetch('/log',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({message})
    });
    const data = await res.text();
    alert(data);
});