import { productList } from "../constants/products.js";

let props = {id:0,name:'',price:0,category:'',description:''}

let isDupe = id => {
    return productList.filter(product => product.id === id)
}

const getAll = (_, response) => {
  return response.status(200).json({data: productList})
};

const getById = async (request, response) => {
  let { id } = request.params
  let found = await productList.filter(el => el.id === id)
  return found ? response.status(200).json({ data: found }) : response.status(404).json({ message: 'Not Found'})
};
const getByCategory = async (req, res) => {
    let query = req.query.category
    let reg = new RegExp(query, 'i')
    let found = await productList.filter(el => reg.test(el.category))
    return found ? res.status(200).json({ data: found }) : response.status(404).json({ message: 'Not Found' }) 
}

const createProduct = (req, res) => {
    let product = req.body
    let msg = []
    let errors = {}
    let isDuplicate = isDupe(product.id)
    if(isDuplicate) return res.status(400).json({ message: `id sudah ada didalam productList, silahkan masukkan id > ${productList.length}`})
    Object.entries(props).forEach(([k,v]) => {
        if(product[k] === undefined){
            msg.push(`${k} kosong, Mohon diisi dahulu~`)
        }
        if(typeof product[k] !== typeof v){
            msg.push(`${k} harus bertipe data ${typeof v}`)
        }
    })

    msg.map((ms,i) => errors[`error_${i}`] = ms)


    return msg.length > 0 ? res.status(400).json(msg) : res.status(201).json({ id: product.id })
}

const updateById = (req, res) => {
    let { id } = req.params
    let product  = req.body
    let found = productList.filter(pd => pd.id === id)

    if(found) {
        Object.entries(props).forEach(([k,v]) =>{
            if(k !== 'id'){
                found[k] = product[k]
            }
        })
    }

    return found ? response.status(200).json({ message: 'Updated!!' }) : response.status(404).json({ message: 'Not Found'})
}

const deleteById = (req, res) => {
    let { id } = req.params
    let found = false
    productList.map((p, i) => {
        if(p.id === id) {
            found = true
            productList.slice(i , 1)
        }
    })    
    return found ? response.status(200).json({ message: 'Deleteed!!' }) : response.status(404).json({ message: 'Not Found'})
}

export { getAll, getById, createProduct , updateById, deleteById, getByCategory}