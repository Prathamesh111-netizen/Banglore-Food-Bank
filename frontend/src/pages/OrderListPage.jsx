import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { refreshLogin } from '../actions/userActions'
import { listAllOrders } from '../actions/orderActions'
import getDateString from '../utils/getDateString'
import PieChart from '../components/pieChart'
import AreaChart from '../components/areaChart'
import * as XLSX from 'xlsx/xlsx.mjs'

const ProductListPage = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1 // to fetch various pages of orders
  const dispatch = useDispatch()
  const orderListAll = useSelector((state) => state.orderListAll) // to avoid blank screen display
  const { loading, orders, error, page, pages, total } = orderListAll

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { error: userLoginError } = userDetails

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, 'DataSheet.xlsx')
  }

  // refresh access tokens aif user details are failed
  useEffect(() => {
    if (userLoginError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem('userInfo'))
      user && dispatch(refreshLogin(user.email))
    }
  }, [userLoginError, dispatch, userInfo])

  // get all orders by pagenumber
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) dispatch(listAllOrders(pageNumber))
    else history.push('/login')
  }, [dispatch, history, userInfo, pageNumber])

  return (
    <>
      <div
        style={{
          display: 'flex',
        }}
      >
        <PieChart data={orders} />
        <AreaChart />
      </div>

      <Button
        type="button"
        variant="info"
        size="lg"
        onClick={() => downloadExcel(orders)}
      >
        Download As Excel
      </Button>

      <Row className="align-items-center">
        <Col>
          <h1>All Donations ({`${total || 0}`})</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message dismissible variant="danger" duration={10}>
          {error}
        </Message>
      ) : (
        <Table striped bordered responsive className="table-sm text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>TOTAL</th>
              <th>DATE</th>
              <th>PAID</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) => {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>
                      {order.totalPrice.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </td>
                    <td>{getDateString(order.createdAt)}</td>
                    <td>
                      {order.isPaid ? (
                        <i
                          className="fa fa-check"
                          style={{
                            color: 'green',
                          }}
                        />
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{
                            color: 'red',
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {/* {order.isDelivered ? (
												getDateString(order.updatedAt)
											) : (
												<i
													className="fas fa-times"
													style={{
														color: "red"
													}}
												/>
											)} */}
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button
                          variant="link"
                          className="btn-sm"
                          style={{ margin: '0' }}
                        >
                          Details
                        </Button>
                      </LinkContainer>
                    </td>

                    {/* <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around"
                      }}>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="link" className="btn-sm">
                          View Details
                        </Button>
                      </LinkContainer>
                    </td> */}
                  </tr>
                )
              })}
          </tbody>
        </Table>
      )}
      <Paginate pages={pages} page={page} isAdmin={true} forOrders={true} />
    </>
  )
}

export default ProductListPage
