import React, { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa';
import { Card, CardBody, CardGroup, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import AddBudget from '../components/modals/budget/AddBudget';
import AddExpense from '../components/modals/budget/AddExpense';
import { fetchExpense } from '../redux/expense/expenseAction';
import { formatMoney } from '../variables/formatMoney';
import { fetchBudget } from '../redux/budget/budgetAction';
import { getTotalExpenses } from '../redux/expense/totalActions';
import { fetchWallet } from '../redux/wallet/walletAction';
import { connect } from 'react-redux';

const Budget = ({ toggleSide, handleToggleSide, fetchExpense, expense, fetchBudget, budget, getTotalExpenses, total, fetchWallet, wallet}) => {
    const [modal, setModal] = useState(false);
    const [modalEx, setModalEx] = useState(false);
    const [expenseData, setExpenseData] = useState([]);
    const [budgetData, setBudgetData] = useState([]);

    const onClickModalBudget = () => {
        setModal(!modal)
    }
    const onClickModalEx = () => {
        setModalEx(!modalEx)
    }    

    useEffect(() => {
        fetchExpense()
    }, [fetchExpense])

    useEffect(() => {
        fetchBudget()
    }, [fetchBudget])

    useEffect(() => {
        getTotalExpenses()
    }, [getTotalExpenses])

    useEffect(() => {
        fetchWallet()
    }, [fetchWallet])

    useEffect(() => {
        if (expense.length) {
            let expenses = []
            expense.forEach(e => {
                expenses.push({
                    id: e.id,
                    title: e.title,
                    start_date: e.start_date ? e.start_date : e.createdAt,
                    limit_date: e.limit_date ? e.limit_date : e.createdAt,
                    cost: e.cost,
                    repeat: e.repeat,
                    createdAt: e.createdAt
                })
            })
            setExpenseData(expenses)
        }
    }, [expense]);

    useEffect(() => {
        if (budget.length) {
            let budgets = []
            budget.forEach(e => {
                budgets.push({
                    id: e.id,
                    set_budget: e.set_budget,
                    limit_date: e.limit_date ? e.limit_date : e.createdAt,
                    UserId: e.UserId,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt
                })
            })
            setBudgetData(budgets)
        }
    }, [budget]);
    return (
        <div className={`content-wrapper content-wrapper--${!toggleSide ? 'show' : 'hide'}`}>
            <span className="toggle-btn" onClick={handleToggleSide}>
                {!toggleSide ? <FaTimes /> : <FaBars />}
                <h4>Budget</h4>
            </span>


            <Row>
                <Col>
                    <CardGroup className="mt-3">
                        <Card>
                            <CardBody className="text-center">
                                <h4 className="text-primary">
                                    Rp. {formatMoney(wallet.balance)}
                                </h4>
                                <h6>WALLET</h6>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="text-center">
                            {
                                budgetData.map((item, index) => (
                                <h4 className="text-primary" key={index}>
                                    Rp. {formatMoney(item.set_budget)}
                                </h4>))
                            }
                                
                                <h6>BUDGET</h6>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="text-center">
                                <h4 className="text-primary">
                                    Rp. {formatMoney(total.total)}
                                </h4>
                                <h6>EXPENSES</h6>
                            </CardBody>
                        </Card>
                    </CardGroup>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <CardGroup>
                        <Card>
                            <CardBody className="text-center" style={{ alignItems: 'center' }}>
                                <button className="btn btn-primary" onClick={() => onClickModalBudget()} ><FaPlus /> Add Budget</button>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="text-center" style={{ alignItems: 'center' }}>
                                <button className="btn btn-primary" onClick={() => onClickModalEx()}><FaPlus /> Add Expenses</button>
                            </CardBody>
                        </Card>
                    </CardGroup>
                </Col>
            </Row>

            {/* <TableDummy expense={data} /> */}
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Expense History</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Table responsive>
                                <thead className="text-primary">
                                    <tr>
                                        <th>Title</th>
                                        <th>Cost</th>
                                        <th>Repeat</th>
                                        <th>Start Date</th>
                                        <th>Limit Date</th>
                                        {/* <th className="text-right">Details</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        expenseData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.title}</td>
                                                <td>Rp {formatMoney(item.cost)}</td>
                                                <td>{item.repeat}</td>
                                                <td>{item.start_date}</td>
                                                <td>{item.limit_date}</td>
                                                {/* <td className="text-right"><button className="btn btn-primary btn-sm">Details</button></td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <AddBudget 
                modal={modal} 
                setModal={setModal}/>
            <AddExpense 
                modalEx={modalEx} 
                setModalEx={setModalEx}/>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        expense: state.expense.expenses,
        loading: state.expense.loading,
        error: state.expense.error,
        budget: state.budget.budgets,
        loadingBudget: state.budget.loading,
        errorBudget: state.budget.error,
        total: state.total.totalExpenses,
        wallet: state.wallet.wallets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchExpense: () => dispatch(fetchExpense()),
        fetchBudget: () => dispatch(fetchBudget()),
        getTotalExpenses: () => dispatch(getTotalExpenses()),
        fetchWallet: () => dispatch(fetchWallet()),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Budget);
