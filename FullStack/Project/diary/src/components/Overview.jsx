import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
export default function Overview() {
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState(false);
    const [expense, setExpense] = useState(0);
    const [earning, setEarning] = useState(0);

    useEffect(() => {
        const api = 'http://localhost:2000/user/show'
        fetch(api).then((res) => res.json()
        ).then((res) => {

            if (res.entries.length === 0) {
                setMsg(true);
            } else {
                setMsg(false);
                setData(res.entries);
                let totalExp = 0;
                let totalEar = 0;

                data.map((u) => {
                    totalExp += u.expense
                    totalEar += u.earning
                })
                setExpense(totalExp)
                setEarning(totalEar)
            }
        }).catch((err) => {
            console.log(err);

        })
    }, [data])
    const navigate = useNavigate()
    return (
        <><div className="row justify-content-center my-5 ">
            <div className="col-8">
                {msg ? <div className="row text-center text-danger bg-dark p-5 fs-2 "><div className="col"><i class="fa-solid fa-exclamation mx-2 bg-danger p-4  rounded-pill text-dark"></i>Please Enter Entry </div></div> :
                    <table class="table table-dark">
                        <thead>
                            <tr >
                                <th scope="col">Sr no.</th>
                                <th scope="col">Date</th>
                                <th scope="col">Name</th>
                                <th scope="col">Expense</th>
                                <th scope="col">Earning</th>
                                <th scope="col">Delete</th>
                                <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((entry, key) => (
                                    <tr className="">
                                        <th className="bg-light text-dark" scope="row" key={entry.id}>{key + 1}</th>
                                        <td className="bg-light text-dark">{entry.date.toString().substring(0, 10)}</td>
                                        <td className="bg-light text-dark">{entry.name}</td>
                                        <td className="bg-light text-dark">{entry.expense}</td>
                                        <td className="bg-light text-dark">{entry.earning}</td>
                                        <td className="bg-light text-dark"><button className="btn btn-danger" onClick={() => {
                                            fetch('http://localhost:2000/user/delete/' + entry.id, { method: 'DELETE' }).then((res) => {
                                                res.json();
                                            }).then((res) => {
                                                console.log(res);

                                            })
                                        }}>delete</button></td>
                                        <td className="bg-light text-dark"><button className="btn btn-dark" onClick={() => {
                                            fetch('http://localhost:2000/user/edit/' + entry.id, { method: 'PATCH' }).then((res) => {
                                                res.json();
                                            }).then((res) => {
                                                console.log(res);
                                                navigate(`/edit/${entry.id}`);
                                            })
                                        }}>Edit</button></td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>}

            </div>
        </div>

            {msg ? null :(
                <div className="container bg-dark text-light">
                    <div className="row justify-content-center ">
                        <div className="col-auto fs-2 mx-4">
                            Total Earning :
                        </div>
                        <div className="col-auto fs-2 mx-4">
                            {earning}
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto fs-2 mx-4">
                            Total Expense :
                        </div>
                        <div className="col-auto fs-2 mx-4">
                            {expense}
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto fs-2 mx-4">
                            Total Profit :
                        </div>
                        <div className={`col-auto fs-2 ${earning - expense >= 0 ? 'bg-success' : 'bg-danger'} rounded mx-4`}>
                            {earning - expense}
                        </div>
                    </div>
                </div>
                )}

        </>
    )
}