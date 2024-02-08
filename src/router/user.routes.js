import express from "express"
import UserDTO from "../dao/DTOs/user.dto.js"
import {transport, uploader} from "../utils.js"
import Users from "../dao/mongo/Users.dao.js"

const userRouter = express.Router()
const usersDao = new Users()

// Get Users
userRouter.get("/", async (req, res) => {
    try {
      req.logger.info('Loading users');
      let result = await usersDao.get();
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      req.logger.error('Error loading users');
      res.status(500).send({ status: "error", message: "Internal server error" });
    }
  });

// Create Users
userRouter.post("/", async (req, res) => {
  try {
    let { first_name, last_name, email, age, password, rol } = req.body;
    let user = new UserDTO({ first_name, last_name, email, age, password, rol });
    let result = await userService.createUser(user);
    if (result) {
      req.logger.info('User created successfully');
    } else {
      req.logger.error("Error creating user");
    }
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
});

//Actualizar Rol Usuario
userRouter.post("/premium/:uid", async (req, res) => {
  try {
    const { rol } = req.body;
    const allowedRoles = ['premium', 'admin', 'user'];
    const uid = req.params.uid;

    if (!allowedRoles.includes(rol)) {
        req.logger.error('Invalid role provided');      
        return res.status(400).json({ error: 'Rol not valid' });
    }

    // Verifica  si el usuario tiene los documentos requeridos
    if (!(await hasRequiredDocuments(uid))) {
        req.logger.error('User does not have the required documents for the premium role');      
        return res.status(400).json({ error: 'User does not have required documents for premium role' });    }

    let changeRol = await userService.updUserRol({ uid, rol });

    if (changeRol) {
        req.logger.info('Role is updated correctly'); 
        res.status(200).json({ message: 'Role updated successfully' });
    } else {
        req.logger.error('Error updating role'); 
        res.status(500).json({ error: 'Failed to update role' });
    }
  } catch (error) {
    req.logger.error('/premium/:uid path error'); 
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Eliminar Usuario segun last_connection
userRouter.delete('/', async (req, res) => {
  try {
    // Fecha Actual
    const currentDate = new Date();
    const cutoffDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000); // Calculo de 2 dias para validar last_connection
    // Eliminar usuarios inactivos
    const result = await usersDao.deleteUsersByFilter({ last_connection: { $lt: cutoffDate } });
    if(result.length > 0){
      // Enviar correos electrónicos a los usuarios eliminados
      for (const userEmail of result) {
      await transport.sendMail({
        from: 'mconsuelobeckett@gmail.com', 
        to: userEmail,
        subject: 'Account deletion due to inactivity', 
        text: 'Your account has been deleted due to inactivity.'
      });
    }
    res.status(200).json({ message: 'Users successfully deleted.' }); }else{ 
        res.status(500).json({ message: 'No users were deleted due to inactivity' });
  } 
}catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting users.' });  }
});
const allFiles = [];
userRouter.post("/:uid/documents", uploader.fields([
  { name: 'profiles', maxCount: 2 },    // Puedes ajustar el límite de archivos según tus necesidades
  { name: 'products', maxCount: 2 },
  { name: 'documents', maxCount: 2 },
  { name: 'domicile_proof', maxCount: 1 }, 
  { name: 'account_status_proof', maxCount: 1 }
]), async(req, res) => {
  const files = req.files;
  const userId = req.params.uid
  let user = await usersDao.getUserById(userId)
  if (!user) {
    return res.status(404).json({ status: 'error', error: 'User not found' }); 
 }
  
  if (files['profiles']) {
    const profiles = files['profiles'].map(file => ({ name: 'profiles', path: file.path }));
    
    usersDao.updateDocuments(userId, ...profiles)
    allFiles.push(...profiles);
  }

  if (files['products']) {
    const productFiles = files['products'].map(file => ({ name: 'products', path: file.path }));
   
   
    allFiles.push(...productFiles);
    usersDao.updateDocuments(userId, ...productFiles)
  }

  if (files['documents']) {
    const documentFiles = files['documents'].map(file => ({ name: 'documents', reference: file.path }));
    
    usersDao.updateDocuments(userId, ...documentFiles)
    allFiles.push(...documentFiles);
  }
  if (files['identificacion']) {
    const identificacionFiles = files['identificacion'].map(file => ({ name: 'identificacion', reference: file.path }));
    
    usersDao.updateDocuments(userId, ...identificacionFiles)
    allFiles.push(...identificacionFiles);
  }
  if (files['domicile_proof']) {
    const domicile_proofFiles = files['domicile_proof'].map(file => ({ name: 'domicile_proof', reference: file.path }));
    
    usersDao.updateDocuments(userId, ...domicile_proofFiles)
    allFiles.push(...domicile_proofFiles);
  }
  if (files['account_status_proof']) {
    const account_status_proofFiles = files['account_status_proof'].map(file => ({ name: 'account_status_proof', reference: file.path }));
   
    usersDao.updateDocuments(userId, ...account_status_proofFiles)
    allFiles.push(...account_status_proofFiles);
  }

  res.send({ status: "success", message: "Saved Files" });});

export default userRouter