import React from 'react'
import { Button,Image,View,Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissons from 'expo-permissions'

export default class PickImage extends React.Component{
    state={
        image:null
    }

    getPermission = async()=>{
        if (Platform.OS !== 'web'){
            const{status} = await Permissons.askAsync(Permissons.CAMERA_ROLL)

            if (status !== 'granted'){
                alert('SORRY , CAMERA NEEDS PERMISSION')
            }
        }
    }

    componentDidMount(){
        this.getPermission()
    }

    uploadImage = async(uri) =>{
        const{data} = new FormData()
        let{fileName} = uri.split('/')[uri.split('/').length-1]
        let{type} = `image/${uri.split('.')[uri.split('.').length-1]}`
        const{filetoupload} = {
            uri:uri,
            name:fileName,
            type:type
        }

        data.append('digit',filetoupload)

        fetch('', {
            method:'POST',
            body:data,
            headers:{
                'content-type':'multipart/form-data'
            }
        }).then((response)=>response.json())
        .then((result)=>console.log('SUCCESS:',result))
        .catch((error)=>{console.error('ERROR: ',error)})
        
    }

    _pickImage = async() =>{
        try{
            let{result} = await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,aspect:[4,3] , quality:1})

            if (!result.cancelled){
                this.setState({
                    image:result.data

                })

                this.uploadImage(result.uri)
            }
        }

        catch(e){
            console.log(e)
        }
        
    }

    render(){
        let{image} = this.state
        return(
            <View style = {{flex:1 , alignItems:'center' , justifyContent:'center'}}>

            <Button title='Pick an Image' onPress={this._pickImage}/>
            
            </View>


        )
    }

   
}