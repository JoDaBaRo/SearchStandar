import React, { Component } from 'react';
import { gsap } from 'gsap';
import './search.css';
// import ClassroomsJson from '../../samples/index.json';

export default class InputSearch extends Component {

    state = {
        classrooms: [],
        allItems: [],
        classroomsView: [],
        nameSelected: 'Prueba',
        comentsSelected: 'Esto es un comentario',
        coorSelected: '17, 26',
    }

    async componentDidMount() {
        const res = await fetch('https://ubicate-ufps-api.herokuapp.com/api/v1/classrooms');
        const data = await res.json();
        var list = [];
        data.forEach(element => {
            var obj = {
                id: '',
                type: '',
                name: '',
                nameBuilding: '',
                comments: '',
                coors: ''
            }
            obj.name = element.building.name
            obj.id = element.building.id
            obj.type = 'building'
            obj.comments = element.building.comments
            obj.coors = element.building.x_position+', '+element.building.y_position
            list.push(obj);
        });
        data.forEach(building => {
            building.building.floors.forEach(element => {
                element.classrooms.forEach(element => {
                    var obj = {
                        id: '',
                        type: '',
                        name: '',
                        nameBuilding: '',
                        coors: ''
                    }
                    obj.name = element.name
                    obj.id = element.id
                    obj.type = 'classrooms'
                    obj.nameBuilding = building.building.name
                    obj.comments = element.comments
                    obj.coors = building.building.x_position+', '+building.building.y_position
                    list.push(obj);
                });
            });
        });
        this.setState({
            classrooms: data,
            allItems: list,
            classroomsView: list
        })
        console.log(this.state.classrooms);
    }

    onSearch = (e) => {
        this.propSearch();
        e.preventDefault();
    }

    propSearch = () => {
        if(this.state.classroomsView.length > 0){
            console.log(this.state.classroomsView[0])
            this.setState({
                nameSelected: this.state.classroomsView[0].name,
                comentsSelected: this.state.classroomsView[0].comments,
                coorSelected: this.state.classroomsView[0].coors
            });
            gsap.to('#tagSearch', {
                duration: 0,
                display: 'none'
            });
            const elmntHeight = (document.getElementById("formSearch").offsetHeight) + 30;
            const cartHeight = (100 * (window.innerHeight - elmntHeight) / window.innerHeight);
            gsap.to('#cartInfo', {
                duration: 0.5,
                height: cartHeight+'%',
                ease: "back.out(1.2)"
            });
            gsap.to('#formSearch', {
                duration: 0.5,
                top: '3%',
                ease: "back.out(1.2)"
            });
            gsap.to('#input-field', {
                duration: 0.5,
                borderColor: '#b21b1b00',
            });
            gsap.to('#infoclass', {
                duration: 0.5,
                display: 'initial',
            });
        }else{
            gsap.to('#input-field', {
                duration: 0.5,
                borderColor: '#b21b1b',
                x: '10px',
                ease: "elastic.out(0.9, 0.1)"
            });
            gsap.to('#input-field', {
                duration: 0.5,
                borderColor: '#b21b1b',
                x: '-10px',
                ease: "elastic.out(0.9, 0.1)"
            });
        }
    }

    offSearch = () => {
        gsap.to('#tagSearch', {
            duration: 0,
            display: 'block'
        });
        gsap.to('#cartInfo', {
            duration: 0.5,
            height: '0%',
        });
        gsap.to('#formSearch', {
            duration: 0.5,
            top: 'auto',
        });
        gsap.to('#infoclass', {
            duration: 0.5,
            display: 'none',
        });
    }

    onInput = (e) => {
        this.onChangeSearch(e.target.value);
    }

    onSpanClass = async (e) => {
        document.getElementById("search").value = e.target.getAttribute('value');
        await this.onChangeSearch(e.target.getAttribute('value'));
        this.propSearch();
    }

    onChangeSearch = (search) => {
        gsap.to('#input-field', {
            duration: 0.5,
            borderColor: '#b21b1b00',
        });
        this.offSearch();
        var list = [];
        list = this.state.allItems.filter(function(classroom) {
            return classroom.name.toLowerCase().indexOf(search.toLowerCase()) > -1 
        })
        this.setState({
            classroomsView: list,
        })
    }

    render() {
        return <div className="s006">
            <form id="formSearch" onSubmit={this.onSearch}>
                <fieldset id="fieldset">
                    <legend id="tagSearch">Que estas buscando?</legend>
                    <div className="inner-form">
                        <div className="input-field" id="input-field">
                            <button className="btn-search" type="button" onClick={this.onSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </button>
                            <input id="search" type="text" placeholder="Buscar" autoComplete="off" 
                                onChange={this.onInput}
                            />
                        </div>
                    </div>
                    <div className="suggestion-wrap">
                        {
                            this.state.classroomsView.map(classroom => {
                                return <span onClick={this.onSpanClass} value={classroom.name}
                                key={classroom.name+'-'+classroom.type+'-'+classroom.id} 
                                type={classroom.type} 
                                id_value={classroom.id}>{classroom.name}</span>
                            })
                        }
                    </div>
                </fieldset>
            </form>
            <div className="cartInfo" id="cartInfo">
                <div id="infoclass" className="col-12">
                    <div className="col-12 row">
                        <div className="col-12 d-flex justify-content-center"><span className="name_search">{this.state.nameSelected}</span></div>
                    </div>
                    <div className="col-12 row tab_info">
                        <div className="col-4">
                            <div className="panel_info">
                                <div className="d-flex justify-content-center"><span className="name_search sub_title">Comentarios</span></div>
                                <div className="d-flex">
                                    <span className="sub_text">{this.state.comentsSelected}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="panel_info">
                                <div className="d-flex justify-content-center"><span className="name_search sub_title">Ubicacion</span></div>
                                <div id="map_selected">
                                    <p>{this.state.coorSelected}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    }
}