import { useEffect, useState } from 'react';
import { Table, Image, Rate, message, Spin, Skeleton, Divider, Badge, Card } from "antd";
import './App.css';
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { Modal } from 'antd';
import axios from "axios";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [singleP, setSingleP] = useState({});

  const DeleteHandler = async (id) => {
    await setProducts(products.filter(p => p.id !== id))
    message.success('Product Deleted');
  }

  const FetchSingleProduct = (id) => {
    axios.get(`https://fakestoreapi.com/products/${id}`).then((res) => {
      setSingleP(res.data)
    })
  }


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSingleP({});
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        return <Image
          width={100}
          src={record?.image}
        />
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (_, record) => {
        return <Rate disabled={true} allowHalf defaultValue={record?.rating.rate} />
      }
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (_, { id }) => {
        return (
          <>
            <FaTrashAlt style={{ fontSize: "25px", color: 'red', cursor: "pointer" }}
              onClick={() => DeleteHandler(id)} />
            <FaEye style={{ fontSize: "20px", color: 'green', cursor: "pointer" }}
              onClick={() => {
                showModal();
                FetchSingleProduct(id);
              }}
            />


          </>
        )
      }

    },
  ];



  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => setProducts(json))

  }, [])


  return (
    <div className="App">

      {
        products.length ? (<Table dataSource={products} columns={columns} />) :
          <Skeleton />
      }

      <Modal
        title="Detail Product"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        {
          singleP?.id ? (
            <>
              <div style={{ display: "flex" }}>
                <img src={singleP?.image} width="200px" />
                <div style={{ flexDirection: "column" }}>
                  <p style={{ fontSize: '50px' }}>{`${singleP.price}$`}</p>

                  <Badge.Ribbon text="count" >
                    <Card size="small">
                      {`${singleP?.rating?.count}$`}
                    </Card>
                  </Badge.Ribbon>
                  <p style={{ fontSize: '40px' }}>
                    {Array(Math.round(singleP?.rating.rate)).fill("⭐")}
                  </p>
                </div>
                <Divider />



              </div>

              <p>{singleP.title}</p>
              <p>{singleP.category}</p>
              <p>{singleP.description}</p>
            </>
          ) : (

            <Spin size="large" />
          )}


      </Modal>
    </div >
  );
}

export default App;
